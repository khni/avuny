import { IActivityLogService } from "@avuny/activity-log";
import { creationLimitExceeded, ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";

/**
 * Context
 */
type ServiceContext = {
  userId: string;
  requestId: string;
  organizationId: string;
};

type BeforeCreateHook<T, Tx> = (params: {
  data: T;
  tx: Tx;
  context: ServiceContext;
}) => Promise<T | void>;

type AfterCreateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: ServiceContext;
}) => Promise<void>;

export class CreateService<
  R extends IRepository,
  TCreateInput extends Omit<
    Parameters<R["create"]>[0]["data"],
    "organizationId" | "id"
  >,
> {
  constructor(
    private repository: R,
    private config: {
      creationLimit: number;
      moduleName: "role" | "user" | "organization";
    },
  ) {}

  execute =
    <E>(options?: {
      uniqueChecker?: {
        keys: (keyof (TCreateInput & { organizationId: string }))[];
        errorKey: E;
      }[];
      hooks?: {
        beforeCreate?: BeforeCreateHook<TCreateInput, any>;
        afterCreate?: AfterCreateHook<any, any>;
      };
      activityLog?: IActivityLogService;
    }) =>
    async (params: { data: TCreateInput; context: ServiceContext }) => {
      const { data, context } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Creation limit check
      const recordsCount = await this.repository.count({
        where: { organizationId: context.organizationId },
      });

      if (recordsCount >= this.config.creationLimit) {
        return creationLimitExceeded(
          context,
          `${this.config.moduleName}CreateService.create`,
        );
      }

      // 🔴 Unique check
      const uniqueError = await checkUnique<TCreateInput, E>({
        data: { ...data, organizationId: context.organizationId },
        uniqueChecker,
        context,
        repository: this.repository,
        config: {
          moduleName: this.config.moduleName,
          action: "create",
        },
      });

      if (uniqueError) return uniqueError;

      const record = await this.repository.createTransaction(async (tx) => {
        let finalData = { ...data, organizationId: context.organizationId };

        // 🔵 beforeCreate
        if (hooks?.beforeCreate) {
          const modified = await hooks.beforeCreate({
            data: finalData,
            tx,
            context,
          });
          if (modified) {
            finalData = {
              ...modified,
              organizationId: context.organizationId,
            };
          }
        }

        const record = await this.repository.create({
          data: finalData,
          tx,
        });

        await options?.activityLog?.create({
          tx,
          data: {
            event: "create",
            organizationId: context.organizationId,
            resourceId: record.id,
            resourceType: this.config.moduleName,
          },
        });

        // 🟢 afterCreate
        if (hooks?.afterCreate) {
          await hooks.afterCreate({ record, tx, context });
        }

        return record as Awaited<ReturnType<R["create"]>>;
      });

      return ok(
        record,
        context,
        `${this.config.moduleName}CreateService.create`,
      );
    };
}

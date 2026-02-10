import { IActivityLogService } from "@avuny/activity-log";

import { creationLimitExceeded, fail, ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";

/**
 *
 * Hooks
 *
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
  E,
> {
  constructor(
    private repository: R,
    private activityLog: IActivityLogService,
    private config: {
      creationLimit: number;
      moduleName: "role" | "user" | "organization"; // for now
    },
    private uniqueChecker?: {
      keys: (keyof (TCreateInput & { organizationId: string }))[];
      errorKey: E;
    }[],
    private hooks?: {
      beforeCreate?: BeforeCreateHook<TCreateInput, any>;
      afterCreate?: AfterCreateHook<any, any>;
    },
  ) {}
  private async checkUnique<T extends Record<string, any>, E>(params: {
    data: T;
    id?: string;
    uniqueChecker?: {
      keys: (keyof (T & { organizationId: string }))[];
      errorKey: E;
    }[];
    context: { userId: string; requestId: string; organizationId: string };
  }) {
    const { data, uniqueChecker, id, context } = params;

    if (!uniqueChecker?.length) return null;

    for (const rule of uniqueChecker) {
      const where: Record<string, any> = {};

      for (const key of rule.keys) {
        const k = key as string; // safe cast
        where[k] = data[k];
      }

      const hasAll = rule.keys.every((k) => data[k] !== undefined);
      if (!hasAll) continue;

      const existing = await this.repository.find({ where });

      if (!existing) continue;
      if (id && existing.id === id) continue;

      return fail(
        rule.errorKey,
        context,
        `${this.config.moduleName}CreateService.unique`,
      );
    }

    return null;
  }

  execute = async (params: { data: TCreateInput; context: ServiceContext }) => {
    const { data, context } = params;

    const recordsCount = await this.repository.count({
      where: { organizationId: context.organizationId },
    });

    if (recordsCount >= this.config.creationLimit) {
      return creationLimitExceeded(
        context,
        `${this.config.moduleName}CreateService.create`,
      );
    }

    const uniqueError = await this.checkUnique<TCreateInput, E>({
      data: { ...data, organizationId: context.organizationId },
      uniqueChecker: this.uniqueChecker,
      context,
    });

    if (uniqueError) return uniqueError;

    const record = await this.repository.createTransaction(async (tx) => {
      let finalData = { ...data, organizationId: context.organizationId };

      // 🔵 beforeCreate
      if (this.hooks?.beforeCreate) {
        const modified = await this.hooks.beforeCreate({
          data: finalData,
          tx,
          context,
        });
        if (modified)
          finalData = { ...modified, organizationId: context.organizationId };
      }

      const record = await this.repository.create({
        data: finalData,
        tx,
      });

      await this.activityLog.create({
        tx,
        data: {
          event: "create",
          organizationId: context.organizationId,
          resourceId: record.id,
          resourceType: this.config.moduleName,
        },
      });

      // 🟢 afterCreate
      if (this.hooks?.afterCreate) {
        await this.hooks.afterCreate({ record, tx, context });
      }

      return record as Awaited<ReturnType<R["create"]>>;
    });

    return ok(record, context, `${this.config.moduleName}CreateService.create`);
  };
}

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

type BeforeUpdateHook<T, Tx> = (params: {
  data: T;
  id: string;
  tx: Tx;
  context: ServiceContext;
}) => Promise<T | void>;

type AfterUpdateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: ServiceContext;
}) => Promise<void>;

export class UpdateService<
  R extends IRepository,
  TUpdateInput extends Omit<
    Parameters<R["create"]>[0]["data"],
    "organizationId" | "id"
  >,
  E,
> {
  constructor(
    private repository: R,
    private activityLog: IActivityLogService,
    private config: {
      moduleName: "role" | "user" | "organization"; // for now
    },
    private uniqueChecker?: {
      keys: (keyof (TUpdateInput & { organizationId: string }))[];
      errorKey: E;
    }[],
    private hooks?: {
      beforeUpdate?: BeforeUpdateHook<TUpdateInput, any>;
      afterUpdate?: AfterUpdateHook<any, any>;
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
        `${this.config.moduleName}UpdateService.unique`,
      );
    }

    return null;
  }

  execute = async (params: {
    data: TUpdateInput;
    id: string;
    context: ServiceContext;
  }) => {
    const { data, context, id } = params;

    const uniqueError = await this.checkUnique({
      data: { ...data, organizationId: context.organizationId },
      id,
      uniqueChecker: this.uniqueChecker,
      context,
    });

    if (uniqueError) return uniqueError;

    const record = await this.repository.createTransaction(async (tx) => {
      let finalData = { ...data };

      // 🔵 beforeUpdate
      if (this.hooks?.beforeUpdate) {
        const modified = await this.hooks.beforeUpdate({
          data: finalData,
          id,
          tx,
          context,
        });
        if (modified) finalData = modified;
      }

      const record = await this.repository.update({
        data: finalData,
        where: { id },
        tx,
      });

      await this.activityLog.create({
        tx,
        data: {
          event: "update",
          organizationId: context.organizationId,
          resourceId: record.id,
          resourceType: this.config.moduleName,
        },
      });

      // 🟢 afterUpdate
      if (this.hooks?.afterUpdate) {
        await this.hooks.afterUpdate({ record, tx, context });
      }

      return record as Awaited<ReturnType<R["update"]>>;
    });

    return ok(record, context, `${this.config.moduleName}UpdateService.update`);
  };
}

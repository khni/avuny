type ActivityEventType = "create" | "update" | "delete" | "restore" | "archive";

type ActivityActorType = "user" | "system";
type ResourceType =
  | "organization"
  | "role"
  | "user"
  | "item"
  | "invoice"
  | "customer"
  | "supplier"
  | "purchase_order"
  | "sales_order";

export interface IActivityLogService<Tx = unknown> {
  create(params: {
    data: {
      organizationId: string;
      resourceId: string;
      resourceType: ResourceType;
      event: ActivityEventType;
      actorId?: string | null;
      actorType?: ActivityActorType;
      resourceSnapshot?: Record<string, unknown>;
      changes?: {
        before: Record<string, unknown>;
        after: Record<string, unknown>;
      };
    };
    tx?: Tx;
  }): Promise<unknown>;
}

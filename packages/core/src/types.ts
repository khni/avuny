export type Context = {
  userId: string;
  organizationId: string;
  lang: string;
  requestId: string;
};

export type Resource = "rolo" | "user" | "invoice";
export type Action = "read" | "update" | "create" | "delete";

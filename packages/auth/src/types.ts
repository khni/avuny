declare module "hono" {
  interface ContextVariableMap {
    user: { id: string };
  }
}

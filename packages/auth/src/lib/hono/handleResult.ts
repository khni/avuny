import { Context } from "hono";
import { Result } from "../result.js";
import { sendError } from "./createApi.js";

export function handleResult<T, E>(c: Context, result: Result<T, E>) {
  if (!result.success) {
    return sendError(c, result.error);
  }

  return c.json({
    success: true,
    data: result.data,
  });
}

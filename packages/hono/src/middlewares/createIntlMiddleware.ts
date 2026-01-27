import type { MiddlewareHandler } from "hono";
import { type InitIntlParams, initIntl } from "@avuny/intl";

export const createIntlMiddleware =
  ({ resources }: InitIntlParams): MiddlewareHandler =>
  async (c, next) => {
    const lang =
      c.req.header("x-lang") ||
      c.req.header("accept-language")?.split(",")[0] ||
      "en";

    // per-request instance
    const t = initIntl({ resources }).getFixedT(lang);

    c.set("t", t);
    c.set("lang", lang);

    await next();
  };

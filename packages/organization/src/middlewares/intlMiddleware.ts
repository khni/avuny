import { createIntlMiddleware } from "@avuny/hono";
import { en } from "../intl/translations/en.js";
import { ar } from "../intl/translations/ar.js";

export const intlMiddleware = createIntlMiddleware({
  resources: {
    en: { translations: en },
    ar: { translations: ar },
  },
});

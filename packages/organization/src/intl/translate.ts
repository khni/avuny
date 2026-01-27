import {
  createTypedT,
  initIntl,
  Locale,
  TOptionsBase,
  TypedT,
} from "@avuny/intl";
import en from "./locales/en.json" with { type: "json" };
import ar from "./locales/ar.json" with { type: "json" };
import { Messages } from "./types.js";

export class OrganizationTrans {
  private t: ReturnType<ReturnType<typeof initIntl>["getFixedT"]>;

  constructor(lang: Locale) {
    this.t = initIntl({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
    }).getFixedT(lang);
  }

  errors = (code: keyof Messages["errors"], options?: TOptionsBase) => {
    return this.t(`errors.MODULE_NAME_CONFLICT`);
  };
}

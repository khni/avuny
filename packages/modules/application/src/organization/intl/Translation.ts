import { Locale, TOptionsBase } from "@avuny/intl";

import { Messages } from "./types.js";
import { Namespace, TFunction } from "i18next";
import { trans } from "../../Translation.js";

export class Translation {
  private t: TFunction<Namespace, undefined>;

  constructor(lang: Locale) {
    this.t = trans({ lang });
  }

  errors = (code: keyof Messages["errors"], options?: TOptionsBase) => {
    return this.t(`organization:errors.${code}`);
  };
}

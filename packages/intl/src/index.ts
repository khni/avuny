import i18n, { Resource, ResourceLanguage } from "i18next";
import type { Locale } from "./types.js";

export { type Locale };
export type InitIntlParams = {
  resources?: {
    [key in Locale]: { translations: {} };
  };
};
export const initIntl = ({ resources }: InitIntlParams) => {
  i18n.init({
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};

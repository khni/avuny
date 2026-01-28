import i18n, { Resource, ResourceLanguage, TOptionsBase } from "i18next";
import type { Locale } from "./types.js";
export * from "./TypedT.js";
export { type Locale };
export type InitIntlParams = {
  resources?: {
    [key in Locale]: { translation: {} };
  };
};
export { type TOptionsBase };
export const initIntl = ({ resources }: InitIntlParams) => {
  i18n.init({
    fallbackLng: "en",
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    keySeparator: ".",
    nsSeparator: false, //  disable namespace splitting
  });

  return i18n;
};

import type en from "../organization/intl/locales/en.json";

type Messages = typeof en;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      organization: Messages;
    };
  }
}

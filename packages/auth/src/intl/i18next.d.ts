import type en from "./locales/en.json";

type Messages = typeof en;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: Messages;
    };
  }
}

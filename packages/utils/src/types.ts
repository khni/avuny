import { ClientErrorStatusCode } from "./http-status.js";

export type Locale = "en" | "ar";

export type ErrorMeta = {
  statusCode: ClientErrorStatusCode;
  responseMessage: {
    en: string;
  } & Partial<Record<Exclude<Locale, "en">, string>>;
};

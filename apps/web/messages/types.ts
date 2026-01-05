import commonMessages from "./common/en.json";
import authMessages from "../src/features/auth/translations/messages/en.json";

export type Messages = typeof commonMessages & typeof authMessages;

export const messages: Messages = {
  ...commonMessages,
  ...authMessages,
};

import commonMessages from "./common/en.json";
import authMessages from "../src/features/auth/translations/messages/en.json";
import organizationMessages from "../src/features/organization/translations/messages/en.json";

export type Messages = typeof commonMessages &
  typeof authMessages &
  typeof organizationMessages;

export const messages: Messages = {
  ...commonMessages,
  ...authMessages,
  ...organizationMessages,
};

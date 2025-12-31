import commonMessages from "./common/en.json";

export type Messages = typeof commonMessages;
export const messages: Messages = {
  ...commonMessages,
};

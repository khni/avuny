export type UserType = {
  id: string;
  name: string;
  password: string;
  identifier: string;
  identifierType: "email" | "phone";
};
export type UserCreateInput = {
  name: string;
  identifier: string;
  identifierType: "email" | "phone";
  password: string;
};

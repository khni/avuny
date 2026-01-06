import { ErrorMeta } from "@avuny/utils";
import {
  createDomainErrorResponseSchema,
  ErrorResponseSchema,
} from "../../hono/error-schema.js";
import {
  AuthLoginDomainErrorCodes,
  AuthLoginDomainErrorCodesType,
  AuthSignUpDomainErrorCodes,
  AuthSignUpDomainErrorCodesType,
} from "./errors.js";

export const authLoginErrorMapping = {
  [AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS]: {
    statusCode: 401,
    responseMessage: "Incorrect credentials",
  },

  [AuthLoginDomainErrorCodes.AUTH_LOGIN_USER_PASSWORD_NOT_SET]: {
    statusCode: 400,
    responseMessage: "User password is not set",
  },
} satisfies Record<AuthLoginDomainErrorCodesType, ErrorMeta>;

export const authSignUpErrorMapping = {
  [AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST]: {
    statusCode: 409,
    responseMessage: "User already exists",
  },
} satisfies Record<AuthSignUpDomainErrorCodesType, ErrorMeta>;

export const authSignUpErrorsMap = {
  [409]: {
    code: AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST,
    schema: createDomainErrorResponseSchema([
      AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST,
    ]),
  },
};

export const createAuthSignUpErrorsMap = Object.fromEntries(
  Object.entries(authSignUpErrorMapping).map(([code, meta]) => [
    meta.statusCode,
    {
      code,
      schema: createDomainErrorResponseSchema([code]),
    },
  ])
);

import { ErrorMeta } from "@avuny/utils";

import {
  AuthenticatedCodesType,
  AuthenticatedErrorCodes,
  AuthLoginDomainErrorCodes,
  AuthLoginDomainErrorCodesType,
  AuthSignUpDomainErrorCodes,
  AuthSignUpDomainErrorCodesType,
} from "./errors.js";
import {
  ClientErrorStatusCode,
  ContentfulStatusCode,
} from "hono/utils/http-status";

export const authLoginErrorMapping = {
  [AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS]: {
    statusCode: 401,
    responseMessage: "Incorrect credentials",
  },

  [AuthLoginDomainErrorCodes.AUTH_LOGIN_USER_PASSWORD_NOT_SET]: {
    statusCode: 400,
    responseMessage: "User password is not set",
  },
} satisfies Record<
  AuthLoginDomainErrorCodesType,
  {
    statusCode: ClientErrorStatusCode;
    responseMessage: string;
  }
>;

export const authSignUpErrorMapping = {
  [AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST]: {
    statusCode: 409,
    responseMessage: "User already exists",
  },
} satisfies Record<AuthSignUpDomainErrorCodesType, ErrorMeta>;

export const authenticatedErrorMapping = {
  [AuthenticatedErrorCodes.UNAUTHENTICATED]: {
    statusCode: 401,
    responseMessage: "Unauthenticated",
  },
} satisfies Record<AuthenticatedCodesType, ErrorMeta>;

import { ErrorMeta } from "@avuny/utils";

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

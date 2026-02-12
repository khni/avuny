import { defineErrorMapping } from "@avuny/utils";
import {
  OrganizationUserErrorCode,
  OrganizationUserErrorCodeKeys,
} from "./errorCode.js";

const organizationUserErrorMap =
  defineErrorMapping<OrganizationUserErrorCodeKeys>({
    [OrganizationUserErrorCode.MODULE_NAME_CONFLICT]: {
      statusCode: 403,
      responseMessage: "Name is already in use",
    },

    [OrganizationUserErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
      statusCode: 403,
      responseMessage:
        "You have reached the maximum number of organizations allowed in your plan. Please upgrade your plan to create more organizations.",
    },

    [OrganizationUserErrorCode.USER_EXISTS]: {
      statusCode: 409,
      responseMessage: "The user already exists in this organization",
    },
  });

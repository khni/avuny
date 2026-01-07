import { useTranslations } from "next-intl";

export const useAuthTranslations = () => {
  const authLabels = useTranslations("auth.labels");
  const authHeaderTranslations = useTranslations("auth.headers");
  const authErrorTranslations = useTranslations("auth.errors");
  const authMsgsTranslations = useTranslations("auth.msgs");

  return {
    authLabels,
    authHeaderTranslations,
    authErrorTranslations,
    authMsgsTranslations,
  };
};

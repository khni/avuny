import { useTranslations } from "next-intl";

export const useAuthTranslations = () => {
  const authLabels = useTranslations("auth.labels");
  const authHeaderTranslations = useTranslations("auth.headers");
  const authErrorTranslations = useTranslations("auth.errors");

  return {
    authLabels,
    authHeaderTranslations,
    authErrorTranslations,
  };
};

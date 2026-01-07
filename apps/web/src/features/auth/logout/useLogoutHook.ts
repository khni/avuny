import { useCommonTranslations } from "@/messages/common";
import { toast } from "sonner";

import { useLogout } from "@/src/api";
export function useLogoutHandler() {
  const { statusTranslations } = useCommonTranslations();

  const { mutate: logoutMutate, isPending } = useLogout({
    mutation: {
      onSuccess: () => {
        toast(statusTranslations("success"));

        location.reload();
      },
    },
  });

  const submit = () => {
    localStorage.removeItem("accessToken");
    logoutMutate({ data: {} });
  };

  return { submit, isPending };
}

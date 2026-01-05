"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm } from "@/src/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthTranslations } from "@/src/features/auth/translations/hooks/useAuthTrans";
import { useSignUp } from "@/src/api";
import { LocalRegisterInputSchema as schema } from "@avuny/api";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";
import { ErrorAlert } from "@workspace/ui/blocks/form/ErrorAlert-v2";
export const localRegisterInputSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  name: z.string(),
});

export const SignUpForm = () => {
  const { authLabels, authErrorTranslations } = useAuthTranslations();

  const form = useForm<z.infer<typeof localRegisterInputSchema>>({
    resolver: zodResolver(localRegisterInputSchema),
  });
  const { mutate, isPending, error } = useSignUp();

  return (
    <>
      <CustomForm
        error={error}
        errorMap={authErrorTranslations}
        fields={[
          {
            key: "name",
            content: {
              name: "identifier",
              type: "text",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
          {
            key: "description",
            content: {
              name: "name",
              type: "text",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
          {
            key: "password",
            content: {
              name: "password",
              type: "password",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
        ]}
        getLabel={authLabels}
        form={form}
        api={{ onSubmit: (data) => mutate({ data }), isLoading: isPending }}
      />
    </>
  );
};

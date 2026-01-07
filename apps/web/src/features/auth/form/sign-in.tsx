"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm } from "@/src/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthTranslations } from "@/src/features/auth/translations/hooks/useAuthTrans";
import { useLogin } from "@/src/api";
import { localLoginInputSchema as schema } from "@avuny/api/schemas";
import { useAuthSuccessHandler } from "@/src/features/auth/form/hooks/useAuthSuccessHandler";
import Link from "next/link";

export const SignInForm = () => {
  const {
    authLabels,
    authErrorTranslations,
    authHeaderTranslations,
    authMsgsTranslations,
  } = useAuthTranslations();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onSuccess = useAuthSuccessHandler();
  const { mutate, isPending, error } = useLogin({
    mutation: {
      onSuccess: (data) => onSuccess(data),
    },
  });

  return (
    <>
      <CustomForm
        error={error}
        errorMap={authErrorTranslations}
        cardTitle={authHeaderTranslations("signIn")}
        fields={[
          {
            key: "identifier",
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
      >
        <p className="text-sm text-muted-foreground text-center">
          {authMsgsTranslations("orHaveNotAnAccountSignUp")}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline"
          >
            {" "}
            {authHeaderTranslations("signUp")}
          </Link>
        </p>
      </CustomForm>
    </>
  );
};

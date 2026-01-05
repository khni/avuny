import CustomForm, {
  CustomFormProps,
} from "@workspace/ui/blocks/form/custom-form";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "@workspace/ui/blocks/form/ErrorAlert-v2";

import { useCommonTranslations } from "messages/common/hooks/useCommonTranslations";
import { FieldValues } from "react-hook-form";

export type FormProps<T extends FieldValues, E, S extends string> = {
  children?: React.ReactNode;
} & Omit<
  CustomFormProps<T, E>,
  "isLoadingText" | "submitButtonText" | "children"
> &
  Pick<ErrorAlertProps<S>, "error" | "errorMap" | "errorTitle">;
export const Form = <T extends FieldValues, E, S extends string>({
  form,
  api,
  fields,
  getLabel,
  error,
  errorMap,
  cardTitle,
  cardDescription,
  children,
}: FormProps<T, E, S>) => {
  const {
    placeholderTranslations,
    alertMsgsTranslations,
    statusTranslations,
    actionTranslations,
  } = useCommonTranslations();
  return (
    <CustomForm
      form={form}
      getLabel={getLabel}
      api={api}
      fields={fields}
      isLoadingText={placeholderTranslations("loading")}
      submitButtonText={actionTranslations("submit")}
      cardTitle={cardTitle}
      cardDescription={cardDescription}
    >
      {children}
      <ErrorAlert
        errorTitle={statusTranslations("error")}
        // errorDescriptionFallback={alertMsgsTranslations("unknownError")}
        error={error}
        errorMap={errorMap}
      />
    </CustomForm>
  );
};

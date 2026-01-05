"use client";
import {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  Path,
} from "react-hook-form";

import { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import React from "react";
import { Form } from "@workspace/ui/components/form";
import DynamicGrid, {
  DynamicGridItem,
} from "@workspace/ui/blocks/grid/dynamic-grid";
import DynamicFields, {
  DynamicField,
} from "@workspace/ui/blocks/form/dynamic-fields";
import SubmitButton from "@workspace/ui/blocks/form/submit-button";
import { ErrorAlert } from "@workspace/ui/blocks/form/ErrorAlert";

// ------------------
// Props
// ------------------
export interface CustomFormProps<T extends FieldValues, E> {
  form: UseFormReturn<T>;
  fields?: DynamicGridItem<DynamicField<T, E>>[];
  getLabel?: (name: Path<T>) => string;
  cardTitle?: string;
  cardDescription?: string;

  submitButtonPosition?: "center" | "left" | "right" | "full";
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  api: { onSubmit: SubmitHandler<T>; isLoading: boolean };

  footerContent?: ReactNode;
  className?: string;
  formClassName?: string;

  children: React.ReactNode;

  submitButtonText?: string;
  isLoadingText: string;
}

// ------------------
// Component
// ------------------
const CustomForm = <T extends FieldValues, E>({
  form,
  fields,
  cardTitle = "Form",
  cardDescription = "",
  submitButtonText = "submit",
  submitButtonPosition = "full",
  submitButtonVariant = "default",

  footerContent,
  className,
  formClassName = "space-y-6",
  api,
  isLoadingText = "isLoading...",
  getLabel,

  children,
}: CustomFormProps<T, E>) => {
  const getButtonPositionClass = () => {
    switch (submitButtonPosition) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      default:
        return "";
    }
  };
  const { isLoading, onSubmit } = api;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        {cardDescription && (
          <CardDescription>{cardDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={formClassName}
          >
            <>
              {fields ? (
                <DynamicGrid
                  items={fields}
                  contentMapper={(content: any) => (
                    <DynamicFields fields={[{ ...content, getLabel, form }]} />
                  )}
                />
              ) : null}
              {children}
            </>
            <div className={`flex ${getButtonPositionClass()} mt-6`}>
              <SubmitButton
                isLoading={isLoading}
                loadingText={isLoadingText}
                submitText={submitButtonText}
              />
            </div>

            {footerContent && <div className="mt-4">{footerContent}</div>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomForm;

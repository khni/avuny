"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createRoleBodySchema } from "@avuny/api/schemas";
import { z } from "@avuny/zod";
import { useTranslations } from "next-intl";
import { useCommonTranslations } from "@/messages/common";
import { GetRoleById200, GetRoleById200DataAnyOf } from "@/src/api/model";
import Permissions from "@/src/features/role/forms/permissions";
const schema = createRoleBodySchema;
export type RoleFormDetailsProps<E, S extends string> = {
  role?: GetRoleById200DataAnyOf;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
};

export default function RoleFormDetails<E, S extends string>({
  role,
  customForm,
}: RoleFormDetailsProps<E, S>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        ...role,
        permissions: role.rolePermissions ?? [],
      });
      setSelectedPermissions(role.rolePermissions ?? []);
    }
  }, [role, form]);
  const { actionTranslations } = useCommonTranslations();
  const fieldTranslations = useTranslations("role.form.fields");
  const cardTitleTranslation = useTranslations("role.form");

  const [selectedPermissions, setSelectedPermissions] = useState(
    role?.rolePermissions || [],
  );
  useEffect(() => {
    form.setValue("permissions", selectedPermissions, {
      shouldValidate: true,
    });
  }, [selectedPermissions, form]);
  const setPermissions = (
    permissions: GetRoleById200DataAnyOf["rolePermissions"],
  ) => {
    setSelectedPermissions(permissions);
  };

  const originalOnSubmit = customForm.api.onSubmit;

  return (
    <>
      <CustomForm
        {...customForm}
        api={{
          ...customForm.api,
          onSubmit: (data, event) =>
            originalOnSubmit(
              {
                ...data,
                permissions: selectedPermissions,
              },
              event,
            ),
        }}
        form={form}
        getLabel={
          fieldTranslations as
            | ((
                name:
                  | "name"
                  | "description"
                  | "permissions"
                  | `permissions.${number}`
                  | `permissions.${number}.permissionId`,
              ) => string)
            | undefined
        }
        resourceName="role"
        actionName={role ? "update" : "create"}
        fields={[
          {
            key: "name",
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
            key: "description",
            content: {
              name: "description",
              type: "text",
            },

            spans: {
              base: 4,
              md: 2,
            },
          },
        ]}
      >
        <Permissions
          permissions={selectedPermissions}
          setPermissions={setPermissions}
        />
      </CustomForm>
    </>
  );
}

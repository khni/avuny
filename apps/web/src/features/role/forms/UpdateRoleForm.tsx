import { useUpdateRole } from "@/src/api";
import { GetRoleById200DataAnyOf } from "@/src/api/model";
import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import React from "react";

export const UpdateRoleForm = ({ role }: { role: GetRoleById200DataAnyOf }) => {
  const { mutateAsync, isPending, error } = useUpdateRole();
  return (
    <div>
      <RoleFormDetails
        customForm={{
          api: {
            onSubmit: async (data) => mutateAsync({ data: data, id: role.id }),
            isLoading: isPending,
          },
          error,
        }}
      />
    </div>
  );
};

import { useUpdateRole } from "@/src/api";
import { GetRoleById200DataAnyOf } from "@/src/api/model";
import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import React from "react";

function UpdateRoleForm(role: GetRoleById200DataAnyOf) {
  const { mutate, isPending, error } = useUpdateRole();
  return (
    <div>
      <RoleFormDetails
        customForm={{
          api: {
            onSubmit: (data) => mutate({ data: data, id: role.id }),
            isLoading: isPending,
          },
          error,
        }}
      />
    </div>
  );
}

export default UpdateRoleForm;

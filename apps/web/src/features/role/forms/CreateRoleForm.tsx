import { useCreateRole } from "@/src/api";
import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import React from "react";

function CreateRoleForm() {
  const { mutate, isPending, error } = useCreateRole();
  return (
    <div>
      <RoleFormDetails
        customForm={{
          api: { onSubmit: (data) => mutate({ data }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
}

export default CreateRoleForm;

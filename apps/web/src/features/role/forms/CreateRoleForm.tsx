import { useCreateRole } from "@/src/api";
import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import React from "react";

function CreateRoleForm() {
  const { isPending, error, mutateAsync } = useCreateRole();
  return (
    <div>
      <RoleFormDetails
        customForm={{
          api: {
            onSubmit: async (data) => await mutateAsync({ data }),
            isLoading: isPending,
          },
          error,
        }}
      />
    </div>
  );
}

export default CreateRoleForm;

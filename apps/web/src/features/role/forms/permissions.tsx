import React, { useState } from "react";
import { ItemOptionMatrix } from "@workspace/ui/blocks/item-option-matrix";
import { useGetPermissionsMatrix } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { GetRoleById200DataAnyOf } from "@/src/api/model";

function Permissions({
  permissions,
  setPermissions,
}: {
  permissions: GetRoleById200DataAnyOf["rolePermissions"];
  setPermissions: (
    permissions: GetRoleById200DataAnyOf["rolePermissions"],
  ) => void;
}) {
  const { data, isPending } = useGetPermissionsMatrix();

  //this will come from rolePermissions

  if (isPending) {
    return <LoadingPage />;
  }
  if (!data) {
    return "Error";
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold">Role Permissions</h2>

      <ItemOptionMatrix
        resources={data.data.resources}
        actions={data.data.actions}
        permissions={data.data.permissions}
        selectedPermissions={permissions}
        onChange={setPermissions}
      />
    </div>
  );
}

export default Permissions;

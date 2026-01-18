import React, { useState } from "react";
import { ItemOptionMatrix } from "@workspace/ui/blocks/item-option-matrix";
import { useGetPermissionsMatrix } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";

function Permissions() {
  const { data, isPending } = useGetPermissionsMatrix();

  //this will come from rolePermissions
  const [selectedPermissions, setSelectedPermissions] = useState([
    { id: "sp1", permissionId: "28c9da49-520c-447b-9608-6b6f92089bc8" },
    { id: "sp2", permissionId: "5d5fd81f-9f44-4010-896f-b0b8e86f0878" },
    { id: "sp3", permissionId: "d6d4a9e8-1884-4ace-b975-506130ac63f4" },
  ]);
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
        selectedPermissions={selectedPermissions}
        onChange={setSelectedPermissions}
      />
      <pre className=" p-3 rounded text-sm">
        {JSON.stringify(selectedPermissions, null, 2)}
      </pre>
    </div>
  );
}

export default Permissions;

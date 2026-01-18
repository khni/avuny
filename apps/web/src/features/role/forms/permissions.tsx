import React, { useState } from "react";
import { ItemOptionMatrix } from "@workspace/ui/blocks/item-option-matrix";
const actions = [
  { id: "create", name: "Create" },
  { id: "update", name: "Update" },
  { id: "delete", name: "Delete" },
];

const resources = [
  { id: "users", name: "Users" },
  { id: "projects", name: "Projects" },
  { id: "reports", name: "Reports" },
];

const permissions = [
  // Users
  { id: "p1", actionId: "create", resourceId: "users" },
  { id: "p2", actionId: "update", resourceId: "users" },
  { id: "p3", actionId: "delete", resourceId: "users" },

  // Projects
  { id: "p4", actionId: "create", resourceId: "projects" },
  { id: "p5", actionId: "update", resourceId: "projects" },
  { id: "p6", actionId: "delete", resourceId: "projects" },

  // Reports
  { id: "p7", actionId: "create", resourceId: "reports" },
  { id: "p8", actionId: "update", resourceId: "reports" },
];

function Permissions() {
  const [selectedPermissions, setSelectedPermissions] = useState([
    { id: "sp1", permissionId: "p1" }, // Users → Create
    { id: "sp2", permissionId: "p5" }, // Projects → Update
  ]);

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold">Role Permissions</h2>

      <ItemOptionMatrix
        resources={resources}
        actions={actions}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onChange={setSelectedPermissions}
      />
    </div>
  );
}

export default Permissions;

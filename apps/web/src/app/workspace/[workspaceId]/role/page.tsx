"use client";
import CreateRoleForm from "@/src/features/role/forms/CreateRoleForm";
import RoleCreateForm from "@/src/features/role/forms/index";
import RoleFormButton from "@/src/features/role/forms/RoleFormButton";
import { RoleDataTable } from "@/src/features/role/list/components/data-table";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import React from "react";

function Page() {
  return (
    <ListPageLayout
      breadCrumbItems={[{ name: "home", href: ROUTES.app.index() }]}
      createResourceButton={<RoleFormButton />}
      dataTable={<RoleDataTable />}
      resourceName="Role"
    />
  );
}

export default Page;

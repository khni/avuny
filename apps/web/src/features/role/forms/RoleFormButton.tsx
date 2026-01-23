import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import { GetRoleById200DataAnyOf } from "@/src/api/model";
import { UpdateRoleForm } from "@/src/features/role/forms/UpdateRoleForm";
import { CreateRoleForm } from "@/src/features/role/forms/CreateRoleForm";
import ActionButton from "@workspace/ui/blocks/buttons/action-btn";
import { useCommonTranslations } from "@/messages/common";
export const RoleFormButton = ({
  role,
}: {
  role?: GetRoleById200DataAnyOf;
}) => {
  const [open, setOpen] = useState(false);
  const { actionTranslations } = useCommonTranslations();
  const add = actionTranslations("add");
  const edit = actionTranslations("edit");
  return (
    <div>
      <Modal
        trigger={
          <ActionButton
            type={role ? "edit" : "add"}
            onClick={() => {
              setOpen(true);
            }}
            title={role ? edit : add}
          />
        }
        open={open}
        onOpenChange={setOpen}
      >
        {role ? <UpdateRoleForm role={role} /> : <CreateRoleForm />}
      </Modal>
    </div>
  );
};

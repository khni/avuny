import React, { useState } from "react";
import { Modal } from "@workspace/ui/blocks/modal";
import { GetRoleById200DataAnyOf } from "@/src/api/model";
function RoleFormButton(role: GetRoleById200DataAnyOf) {
  const [isModalOpen, setModalOpen] = useState(false);
  const setModalClose = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <Modal></Modal>
    </div>
  );
}

export default RoleFormButton;

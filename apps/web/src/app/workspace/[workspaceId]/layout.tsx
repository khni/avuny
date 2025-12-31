import React, { ReactNode } from "react";

import { CustomLayout } from "@workspace/ui/blocks/layout/custom-layout";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";
export default function WorkSpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = React.use(params);
  return (
    <CustomLayout start={<HomeButton />} end={<ModeSwitcherBtn />}>
      {children}
    </CustomLayout>
  );
}

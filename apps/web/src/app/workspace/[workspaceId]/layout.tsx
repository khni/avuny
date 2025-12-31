import React, { ReactNode } from "react";

import { CustomLayout } from "@workspace/ui/blocks/layout/custom-layout";
export default function WorkSpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = React.use(params);
  return <CustomLayout>{children}</CustomLayout>;
}

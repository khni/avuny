import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = React.use(params);
  //here I will fetch organization by id
  return <div>{workspaceId}</div>;
}

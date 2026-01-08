"use client";
import React, { ReactNode } from "react";

import { CustomLayout } from "@workspace/ui/blocks/layout/custom-layout";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";
import { getLocale } from "next-intl/server";
import {
  userPreferencesContext,
  useUserPreferencesContext,
} from "@workspace/ui/providers/UserPreferencesContext";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import { useIsAuthenticated } from "@/src/api";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";
export default function WorkSpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { locale, rtl } = useUserPreferencesContext();
  const { workspaceId } = React.use(params);
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  return (
    <CustomLayout
      rtl={rtl}
      start={<HomeButton />}
      end={
        <>
          <ModeSwitcherBtn /> <LangaugeSwitcherBtn />{" "}
          <UserButton
            useLogoutHandler={useLogoutHandler}
            isLoading={isLoading}
            user={data?.data}
          />
        </>
      }
    >
      {children}
    </CustomLayout>
  );
}

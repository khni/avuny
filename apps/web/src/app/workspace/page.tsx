"use client";
import React from "react";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import { useIsAuthenticated } from "@/src/api";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";

//snp rfc
export default function Page() {
  const { data, isLoading } = useIsAuthenticated();
  return (
    <div>
      <Navbar
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
      />
      Hello
    </div>
  );
}

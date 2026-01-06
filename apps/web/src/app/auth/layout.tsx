import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar
        end={
          <>
            <ModeSwitcherBtn /> <LangaugeSwitcherBtn />
          </>
        }
      />
      {children}
    </div>
  );
}

import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        end={
          <>
            <ModeSwitcherBtn /> <LangaugeSwitcherBtn />
          </>
        }
      />
      <div className="flex-1 flex flex-col gap-4 bg-muted items-center justify-center p-6 md:p-4">
        {children}
      </div>
    </div>
  );
}

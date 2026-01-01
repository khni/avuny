import React from "react";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import DashboardButton from "@/src/components/buttons/dashboard-btn";

//snp rfc
export default function Page() {
  return (
    <div>
      <Navbar
        end={
          <>
            <DashboardButton user={{}} isLoading={false} />{" "}
            <ModeSwitcherBtn />{" "}
          </>
        }
      />
      {"sss"}
    </div>
  );
}

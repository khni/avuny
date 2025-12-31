import React from "react";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";

//snp rfc
export default function Page() {
  return (
    <div>
      <Navbar start={<HomeButton />} end={<ModeSwitcherBtn />} />
      Hello
    </div>
  );
}

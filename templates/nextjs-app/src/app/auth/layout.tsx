"use client";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import { useUserPreferencesContext } from "@workspace/ui/blocks/providers/UserPreferencesContext";
import { Button } from "@workspace/ui/components/button";
import LanguageSwitcher from "@workspace/ui/core/settings/langauge-switcher";
import { ModeToggle } from "@workspace/ui/core/settings/mode-toggle";
import { HomeIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function LoginPage({ children }: { children: ReactNode }) {
  const { locale, updateLocale, rtl } = useUserPreferencesContext();
  const { setTheme } = useTheme();
  const router = useRouter();
  return (
    <>
      <Navbar
        end={
          <>
            <ModeToggle setTheme={setTheme} />
            <LanguageSwitcher locale={locale} updateLocale={updateLocale} />
          </>
        }
        start={
          <Button
            onClick={() => router.replace("/")}
            variant="outline"
            size="icon"
            className="cursor-pointer"
          >
            <HomeIcon />
          </Button>
        }
      />
      <div className="flex flex-1 flex-col gap-4   bg-muted  h-full   items-center justify-center p-6 md:p-4">
        {children}
      </div>
    </>
  );
}

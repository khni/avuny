"use client";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import { useUserPreferencesContext } from "@workspace/ui/blocks/providers/UserPreferencesContext";
import { Button } from "@workspace/ui/components/button";
import LanguageSwitcher from "@workspace/ui/core/settings/langauge-switcher";
import { ModeToggle } from "@workspace/ui/core/settings/mode-toggle";
import { AppleIcon, HomeIcon, LogInIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const { locale, updateLocale, rtl } = useUserPreferencesContext();
  const { setTheme } = useTheme();
  const t = useTranslations();
  const router = useRouter();
  return (
    <>
      <Navbar
        end={
          <>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
              size="icon"
              className="cursor-pointer"
            >
              <LogInIcon />
            </Button>
            <Button
              onClick={() => router.push("/workspace")}
              variant="outline"
              size="icon"
              className="cursor-pointer"
            >
              <AppleIcon />
            </Button>
            <ModeToggle setTheme={setTheme} />
            <LanguageSwitcher locale={locale} updateLocale={updateLocale} />
          </>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-4">{t("home")}</div>
    </>
  );
}

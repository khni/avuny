"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CookiesProvider } from "react-cookie";
import { useState } from "react";
import { Direction } from "radix-ui";
import { Toaster } from "@workspace/ui/components/sonner";
import UserPreferencesContextProvider from "@/src/providers/UserPreferences";

export function Providers({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "rtl" | "ltr";
}) {
  const [client] = useState(new QueryClient());
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <CookiesProvider>
        <UserPreferencesContextProvider>
          <QueryClientProvider client={client}>
            <Direction.Provider dir={dir}>{children}</Direction.Provider>
            <Toaster />
          </QueryClientProvider>
        </UserPreferencesContextProvider>
      </CookiesProvider>
    </NextThemesProvider>
  );
}

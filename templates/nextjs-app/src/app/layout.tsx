import { Cairo, Geist, Geist_Mono, Roboto } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/src/components/providers";
import LocaleProvider from "@/src/providers/locale-provider";
import { getLocale } from "next-intl/server";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClassName = locale === "ar" ? cairo.variable : roboto.variable;

  return (
    <html
      lang={locale}
      dir={dir}
      className={fontClassName}
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <LocaleProvider>{children}</LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}

import "~/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import Providers from "./providers";
import CustomAnalytics from "~/components/analytics";

export const metadata: Metadata = {
  title: "MindCache",
  description: "MindCache - Your AI-powered assistant",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Toaster />
            <div className="grid h-screen grid-rows-[auto,1fr] font-[family-name:var(--font-geist-sans)]">
              {children}
              <CustomAnalytics />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

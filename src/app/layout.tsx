import "~/styles/globals.css";

import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MainNav } from "./components/main-nav";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="grid h-screen grid-rows-[auto,1fr] font-[family-name:var(--font-geist-sans)] dark:bg-zinc-950">
            <MainNav />
            <main className="h-[calc(100vh-64px)] overflow-y-scroll">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

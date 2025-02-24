import "~/styles/globals.css";

import { type Metadata } from "next";
import localFont from "next/font/local";
import { MainNav } from "./components/main-nav";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "MindCache",
  description: "MindCache - Your AI-powered assistant",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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

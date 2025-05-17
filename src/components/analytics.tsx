/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Script from "next/script";

const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

const beforeSend = (event: string) => {
  return event;
};

const src = isDev
  ? "https://va.vercel-scripts.com/v1/script.debug.js"
  : "/wassup/script.js";

if (typeof window !== "undefined") {
  (window as any).va?.("beforeSend", beforeSend);
}

export default function CustomAnalytics() {
  return (
    <>
      <Script id="meow" strategy="afterInteractive">
        {`window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}
      </Script>
      <Script src={src} data-endpoint="/wassup" strategy="lazyOnload" async />
    </>
  );
}

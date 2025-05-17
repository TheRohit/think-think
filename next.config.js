/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "img.youtube.com",
      },
      {
        hostname: "i.ytimg.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/wassup/:match*",
        destination: "https://mind-cache.rohitm.dev/_vercel/insights/:match*",
      },
    ];
  },
  experimental: {
    reactCompiler: true,
  },
};

export default config;

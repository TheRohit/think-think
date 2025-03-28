import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import type { Session } from "better-auth/types";
import { headers } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";
import { passkey } from "better-auth/plugins/passkey";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type CustomSession = Session & {
  user: AuthUser;
};

export type CustomToken = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    verifyEmail: false,
    passwordMinLength: 8,
    passwordMaxLength: 100,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  security: {
    passwordHash: {
      algorithm: "argon2",
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  plugins: [nextCookies(), passkey()],
});

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

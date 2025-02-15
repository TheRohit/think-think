import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";
import { env } from "~/env";
import type { Session, User } from "better-auth/types";

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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  emailAndPassword: {
    enabled: true,
    verifyEmail: false,
    passwordMinLength: 8,
    passwordMaxLength: 100,
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
  callbacks: {
    async session({
      session,
      user,
    }: {
      session: Session;
      user: User;
    }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        },
      };
    },
    async jwt({
      token,
      user,
    }: {
      token: CustomToken;
      user?: User;
    }): Promise<CustomToken> {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          picture: user.image ?? undefined,
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  plugins: [nextCookies()],
});

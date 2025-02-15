"use server";

import { headers } from "next/headers";
import { useCallback } from "react";
import { auth } from "~/lib/auth";

export async function useAuth() {
  const signOut = async () => {
    await auth.api.signOut({ headers: await headers() });
  };

  const signIn = async (email: string, password: string) => {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: { email, password, name },
    });
  };

  const signInWithGoogle = async () =>
    await auth.api.signInSocial({
      headers: await headers(),
      body: { provider: "google" },
    });

  return {
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
  };
}

import { useCallback } from "react";
import { auth } from "~/lib/auth";
import type { AuthUser, CustomSession } from "~/lib/auth";

export function useAuth() {
  const signOut = useCallback(async () => {
    await auth.signOut();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await auth.signIn({ email, password });
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      await auth.signUp({ email, password, name });
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    await auth.signInWithGoogle();
  }, []);

  return {
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
  };
}

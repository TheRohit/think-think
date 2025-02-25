import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { LoginForm } from "~/components/login-form";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export default async function SignInPage() {
  try {
    const session = await getSession();

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (session && session.user) {
      redirect("/dashboard");
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }

  return (
    <div className="bg-muted flex flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return <></>;
}

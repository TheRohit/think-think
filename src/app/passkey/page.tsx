/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserCard from "~/components/user-card";

import { auth } from "~/lib/auth";

export default async function PasskeyPage() {
  const [session, activeSessions] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.listSessions({
      headers: await headers(),
    }),
  ]).catch(() => {
    redirect("/sign-in");
  });

  return (
    <div>
      <UserCard
        session={JSON.parse(JSON.stringify(session))}
        activeSessions={JSON.parse(JSON.stringify(activeSessions))}
      />
    </div>
  );
}

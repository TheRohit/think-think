import { headers } from "next/headers";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { auth } from "~/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to the AI-powered something {session?.user?.name}
        </h1>
        <Textarea
          placeholder="Enter your text here"
          className="w-full max-w-md"
        />

        <Button variant={"secondary"}>Generate</Button>
      </div>
    </main>
  );
}

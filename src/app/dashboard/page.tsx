import { headers } from "next/headers";
import InputField from "~/components/input-field";
import NotesSection from "~/components/notes-section";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import ClearSessionButton from "~/components/clear-session-button";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default async function Dashboard() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/signin");
    }

    return (
      <div className="flex w-full flex-col items-center gap-28 px-4 py-24 sm:px-6 sm:py-12">
        <div className="flex w-full flex-col items-center gap-8">
          <h1 className="text-shadow-neo scroll-m-20 text-4xl font-extrabold tracking-tight text-orange-400 lg:text-5xl">
            {getGreeting()},{" "}
            <span className="text-[#51b8ff]">
              {session.user.name.split(" ")[0]}
            </span>
          </h1>
          <InputField />
        </div>
        <div className="w-full">
          <NotesSection />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard session error:", error);
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="rounded-lg border-2 border-black bg-red-100 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-bold">Authentication Error</h2>
          <p>
            There was a problem with your session. Please try signing in again.
          </p>
          <ClearSessionButton />
        </div>
      </div>
    );
  }
}

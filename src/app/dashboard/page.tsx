import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InputField from "~/components/input-field";
import NotesSection from "~/components/notes-section";
import { auth } from "~/lib/auth";
import IngestModal from "../components/ingest-modal";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
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
        <IngestModal />
      </div>
      <div className="w-full">
        <NotesSection />
      </div>
    </div>
  );
}

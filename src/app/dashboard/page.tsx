import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchResultsSection from "~/components/search-results-section";
import { auth } from "~/lib/auth";
import { getContentByUserId } from "~/server/db/queries";
import { ContentItem } from "~/types/dashboard.types";
import IngestModal from "../components/ingest/ingest-modal";

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

  const data = await getContentByUserId(session.user.id);

  return (
    <div className="flex w-full flex-col items-center gap-28 px-4 py-24 sm:px-6 sm:py-12">
      <div className="flex w-full flex-col items-center gap-8">
        <h1 className="text-shadow-neo scroll-m-20 text-4xl font-extrabold tracking-tight text-orange-400 lg:text-5xl">
          {getGreeting()},{" "}
          <span className="text-[#51b8ff]">
            {session.user.name.split(" ")[0]}
          </span>
        </h1>

        <SearchResultsSection initialData={data as ContentItem[]} />
      </div>
    </div>
  );
}

import { headers } from "next/headers";
import InputField from "~/components/input-field";
import { auth } from "~/lib/auth";

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
    return <div>Not authenticated</div>;
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-shadow-neo scroll-m-20 text-4xl font-extrabold tracking-tight text-orange-400 lg:text-5xl">
        {getGreeting()},{" "}
        <span className="text-[#51b8ff]">
          {session.user.name.split(" ")[0]}
        </span>
      </h1>
      <InputField />
    </div>
  );
}

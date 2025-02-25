import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

export async function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-16 items-center px-4">
        <h1 className="border-4 border-black bg-green-400 px-4 py-2 text-2xl font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-500">
          MindCache
        </h1>
        <nav
          className={cn(
            "mx-6 flex items-center space-x-4 lg:space-x-6",
            className,
          )}
          {...props}
        >
          {/* <Link
        href="/dashboard"
        className="hover:text-primary text-sm font-medium transition-colors"
      >
        Overview
      </Link>
      <Link
        href="/emi"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        EMI
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Products
      </Link>
      <Link
        href="/settings"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Settings
      </Link> */}
        </nav>
        {session?.user && (
          <div className="ml-auto flex items-center space-x-4">
            <Button
              className="z-10 gap-2"
              variant="neutral"
              onClick={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect("/dashboard");
              }}
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </Suspense>
  );
}

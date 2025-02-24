"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const session = authClient.useSession();

  return (
    <div className="flex h-16 items-center px-4">
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
      {session.data && (
        <div className="ml-auto flex items-center space-x-4">
          <Button
            className="z-10 gap-2"
            variant="neutral"
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}

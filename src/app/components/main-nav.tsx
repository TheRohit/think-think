import Link from "next/link";
import { Button } from "~/components/ui/button";

import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex h-16 items-center bg-zinc-950 px-4">
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
      <div className="ml-auto flex items-center space-x-4">
        <Button variant={"secondary"}>Sign out</Button>
      </div>
    </div>
  );
}

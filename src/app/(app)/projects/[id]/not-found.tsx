import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectNotFound() {
  return (
    <div className="max-w-lg py-12">
      <h1 className="text-xl font-semibold">Project not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        It may have been deleted, or it may belong to a different account.
      </p>
      <Link href="/projects" className={cn(buttonVariants(), "mt-5")}>
        Back to projects
      </Link>
    </div>
  );
}

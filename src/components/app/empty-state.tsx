import { FolderPlus } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center border border-dashed px-6 py-12 text-center">
      <div className="grid size-10 place-items-center rounded-lg bg-muted">
        <FolderPlus className="size-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold">Start with one project</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Give it a name and write down what you are trying to build. You can change it as you learn.
      </p>
      <Link href="/projects/new" className={cn(buttonVariants(), "mt-5")}>
        Create project
      </Link>
    </div>
  );
}


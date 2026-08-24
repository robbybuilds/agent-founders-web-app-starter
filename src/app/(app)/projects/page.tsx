import { Plus } from "lucide-react";
import Link from "next/link";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { EmptyState } from "@/components/app/empty-state";
import { ProjectList } from "@/components/projects/project-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";

export default async function ProjectsPage() {
  const token = await convexAuthNextjsToken();
  const projects = await fetchQuery(api.projects.list, {}, { token });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep the problem, current status, and next decision in one place.
          </p>
        </div>
        <Link href="/projects/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <div className="mt-8">
        {projects.length ? <ProjectList projects={projects} /> : <EmptyState />}
      </div>
    </div>
  );
}

import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/app/empty-state";
import { ProjectList } from "@/components/projects/project-list";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error("Could not load the dashboard.");
  }

  const firstName = String(user.user_metadata.display_name ?? "").trim().split(/\s+/)[0];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {firstName ? `Good to see you, ${firstName}.` : "Good to see you."}
          </h1>
        </div>
        <Link href="/projects/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <section className="mt-10" aria-labelledby="recent-projects">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="recent-projects" className="text-sm font-semibold">Recent projects</h2>
          {projects.length ? (
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          ) : null}
        </div>
        {projects.length ? <ProjectList projects={projects} /> : <EmptyState />}
      </section>
    </div>
  );
}


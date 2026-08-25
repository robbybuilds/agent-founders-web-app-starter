import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Doc } from "@convex/_generated/dataModel";

type Project = Doc<"projects">;

const statusLabels: Record<Project["status"], string> = {
  idea: "Idea",
  building: "Building",
  launched: "Launched",
};

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="divide-y border-y">
      {projects.map((project) => (
        <Link
          key={project._id}
          href={`/projects/${project._id}`}
          className="group flex min-h-24 items-center gap-4 px-1 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-semibold">{project.name}</h2>
              <Badge variant="secondary">{statusLabels[project.status]}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {project.description || "No description yet."}
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}


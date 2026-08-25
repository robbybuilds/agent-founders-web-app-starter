import Link from "next/link";
import { notFound } from "next/navigation";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { updateProject } from "@/app/(app)/projects/actions";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectForm } from "@/components/projects/project-form";
import { projectIdSchema } from "@/lib/validation/project";
import { api } from "@convex/_generated/api";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: queryError } = await searchParams;
  const idResult = projectIdSchema.safeParse(id);

  if (!idResult.success) {
    notFound();
  }

  const token = await convexAuthNextjsToken();
  // The query returns null for a project that does not exist or belongs
  // to someone else, so both cases look like the same not-found page.
  const project = await fetchQuery(api.projects.get, { id: idResult.data }, { token });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
        Back to projects
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm text-muted-foreground">Project</p>
          <h1 className="mt-1 text-2xl font-semibold">{project.name}</h1>
        </div>
        <DeleteProjectDialog projectId={project._id} />
      </div>

      {queryError === "delete" ? (
        <p className="mt-5 text-sm text-destructive">We could not delete this project.</p>
      ) : null}

      <div className="mt-8">
        <ProjectForm action={updateProject} project={project} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProject } from "@/app/(app)/projects/actions";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectForm } from "@/components/projects/project-form";
import { createClient } from "@/lib/supabase/server";
import { projectIdSchema } from "@/lib/validation/project";

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

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", idResult.data)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the project.");
  }

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
        <DeleteProjectDialog projectId={project.id} />
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

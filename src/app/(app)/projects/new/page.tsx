import Link from "next/link";

import { createProject } from "@/app/(app)/projects/actions";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
        Back to projects
      </Link>
      <h1 className="mt-5 text-2xl font-semibold">Create a project</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Start with the clearest version you have. You can refine it after you learn more.
      </p>
      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}


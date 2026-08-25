"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";

import type { FormState } from "@/lib/action-state";
import { projectIdSchema, projectSchema } from "@/lib/validation/project";
import { api } from "@convex/_generated/api";

function projectFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "idea"),
  };
}

async function requireToken() {
  const token = await convexAuthNextjsToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}

function failureMessage(error: unknown, fallback: string) {
  if (error instanceof ConvexError && typeof error.data === "string") {
    return error.data;
  }

  return fallback;
}

export async function createProject(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = projectSchema.safeParse(projectFields(formData));

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const token = await requireToken();
  let projectId: string;

  try {
    projectId = await fetchMutation(api.projects.create, result.data, { token });
  } catch (error) {
    return {
      message: failureMessage(
        error,
        "We could not create the project. Please try again.",
      ),
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${projectId}`);
}

export async function updateProject(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const idResult = projectIdSchema.safeParse(String(formData.get("id") ?? ""));
  const projectResult = projectSchema.safeParse(projectFields(formData));

  if (!idResult.success || !projectResult.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: projectResult.success
        ? undefined
        : projectResult.error.flatten().fieldErrors,
    };
  }

  const token = await requireToken();

  try {
    await fetchMutation(
      api.projects.update,
      { id: idResult.data, ...projectResult.data },
      { token },
    );
  } catch (error) {
    return {
      message: failureMessage(
        error,
        "We could not save the project. Please try again.",
      ),
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${idResult.data}`);

  return { success: true, message: "Project saved." };
}

export async function deleteProject(formData: FormData) {
  const idResult = projectIdSchema.safeParse(String(formData.get("id") ?? ""));

  if (!idResult.success) {
    redirect("/projects");
  }

  const token = await requireToken();

  try {
    await fetchMutation(api.projects.remove, { id: idResult.data }, { token });
  } catch {
    redirect(`/projects/${idResult.data}?error=delete`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/projects");
}

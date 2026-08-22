"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { projectIdSchema, projectSchema } from "@/lib/validation/project";

function projectFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "idea"),
  };
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

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...result.data, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    return { message: "We could not create the project. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
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

  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(projectResult.data)
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (error) {
    return { message: "We could not save the project. Please try again." };
  }

  if (!data) {
    return { message: "That project was not found or does not belong to you." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.id}`);

  return { success: true, message: "Project saved." };
}

export async function deleteProject(formData: FormData) {
  const idResult = projectIdSchema.safeParse(String(formData.get("id") ?? ""));

  if (!idResult.success) {
    redirect("/projects");
  }

  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", idResult.data);

  if (error) {
    redirect(`/projects/${idResult.data}?error=delete`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/projects");
}


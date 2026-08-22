"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/profile";

export async function updateProfile(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = profileSchema.safeParse({
    displayName: String(formData.get("displayName") ?? ""),
  });

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: result.data.displayName });

  if (error) {
    return { message: "We could not save your profile. Please try again." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: result.data.displayName },
  });

  if (authError) {
    return { message: "Your profile was saved, but the header may update after you sign in again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true, message: "Profile saved." };
}


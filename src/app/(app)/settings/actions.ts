"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction, fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";

import type { FormState } from "@/lib/action-state";
import { passwordChangeSchema } from "@/lib/validation/auth";
import { profileSchema } from "@/lib/validation/profile";
import { api } from "@convex/_generated/api";

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

export async function updateAccountPassword(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = passwordChangeSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const token = await requireToken();

  try {
    // The Convex action verifies the current password before changing anything.
    await fetchAction(
      api.users.changePassword,
      {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.password,
      },
      { token },
    );
  } catch (error) {
    return {
      message: failureMessage(
        error,
        "We could not update your password. Please try again.",
      ),
    };
  }

  return { success: true, message: "Your password is updated." };
}

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

  const token = await requireToken();

  try {
    await fetchMutation(
      api.users.updateProfile,
      { name: result.data.displayName },
      { token },
    );
  } catch (error) {
    return {
      message: failureMessage(
        error,
        "We could not save your profile. Please try again.",
      ),
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true, message: "Profile saved." };
}

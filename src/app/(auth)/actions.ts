"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { FormState } from "@/lib/action-state";
import { createClient } from "@/lib/supabase/server";
import {
  emailSchema,
  loginSchema,
  passwordSchema,
  safeRedirectPath,
  signupSchema,
} from "@/lib/validation/auth";

function fields(formData: FormData) {
  return {
    displayName: String(formData.get("displayName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

async function requestOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin) {
    return origin;
  }

  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function signIn(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = loginSchema.safeParse(fields(formData));

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { message: "That email and password did not work." };
  }

  redirect(safeRedirectPath(String(formData.get("next") ?? "")));
}

export async function signUp(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = signupSchema.safeParse(fields(formData));

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { display_name: result.data.displayName },
      emailRedirectTo: `${await requestOrigin()}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    return { message: "We could not create the account. Please try again." };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success: true,
    message: "Check your email to finish creating your account.",
  };
}

export async function requestPasswordReset(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = emailSchema.safeParse(String(formData.get("email") ?? ""));

  if (!result.success) {
    return {
      message: "Enter a valid email address.",
      fieldErrors: { email: result.error.issues.map((issue) => issue.message) },
    };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(result.data, {
    redirectTo: `${await requestOrigin()}/auth/confirm?next=/update-password`,
  });

  return {
    success: true,
    message: "If that account exists, a reset link is on the way.",
  };
}

export async function updatePassword(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = passwordSchema.safeParse(
    String(formData.get("password") ?? ""),
  );

  if (!result.success) {
    return {
      message: "Check the form and try again.",
      fieldErrors: {
        password: result.error.issues.map((issue) => issue.message),
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: result.data });

  if (error) {
    return { message: "We could not update the password. Request a new link." };
  }

  return { success: true, message: "Your password is updated." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

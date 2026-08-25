"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";

import { SubmitButton } from "@/components/app/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/action-state";
import {
  emailSchema,
  loginSchema,
  passwordSchema,
  signupSchema,
} from "@/lib/validation/auth";

type Mode = "login" | "signup" | "forgot" | "update";

type AuthFormProps = {
  mode: Mode;
  nextPath?: string;
  resetEmail?: string;
};

const initialState: FormState = {};

const content: Record<Mode, { title: string; description: string; submit: string }> = {
  login: {
    title: "Welcome back",
    description: "Sign in to keep building.",
    submit: "Sign in",
  },
  signup: {
    title: "Create your account",
    description: "Your projects stay private to your account.",
    submit: "Create account",
  },
  forgot: {
    title: "Reset your password",
    description: "We will send a reset code if the account exists.",
    submit: "Send reset code",
  },
  update: {
    title: "Choose a new password",
    description: "Enter the code from your email and a new password.",
    submit: "Update password",
  },
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof ConvexError && typeof error.data === "string") {
    return error.data;
  }

  return fallback;
}

export function AuthForm({ mode, nextPath, resetEmail }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const details = content[mode];
  const showName = mode === "signup";
  const showEmail = mode !== "update";
  const showPassword = mode === "login" || mode === "signup" || mode === "update";

  function submit(formData: FormData) {
    startTransition(async () => {
      const fields = {
        displayName: String(formData.get("displayName") ?? ""),
        email: String(formData.get("email") ?? resetEmail ?? ""),
        password: String(formData.get("password") ?? ""),
      };

      if (mode === "login") {
        const result = loginSchema.safeParse(fields);

        if (!result.success) {
          setState({
            message: "Check the form and try again.",
            fieldErrors: result.error.flatten().fieldErrors,
          });
          return;
        }

        try {
          await signIn("password", {
            email: result.data.email,
            password: result.data.password,
            flow: "signIn",
          });
        } catch {
          setState({ message: "That email and password did not work." });
          return;
        }

        router.push(nextPath ?? "/dashboard");
      }

      if (mode === "signup") {
        const result = signupSchema.safeParse(fields);

        if (!result.success) {
          setState({
            message: "Check the form and try again.",
            fieldErrors: result.error.flatten().fieldErrors,
          });
          return;
        }

        try {
          await signIn("password", {
            name: result.data.displayName,
            email: result.data.email,
            password: result.data.password,
            flow: "signUp",
          });
        } catch (error) {
          setState({
            message: errorMessage(
              error,
              "We could not create the account. Please try again.",
            ),
          });
          return;
        }

        router.push("/dashboard");
      }

      if (mode === "forgot") {
        const result = emailSchema.safeParse(fields.email);

        if (!result.success) {
          setState({
            message: "Enter a valid email address.",
            fieldErrors: { email: result.error.issues.map((issue) => issue.message) },
          });
          return;
        }

        // Ignore errors on purpose so the form never reveals
        // whether an account exists.
        try {
          await signIn("password", { email: result.data, flow: "reset" });
        } catch {
          // The next page explains what to do if no code arrives.
        }

        router.push(`/update-password?email=${encodeURIComponent(result.data)}`);
      }

      if (mode === "update") {
        const code = String(formData.get("code") ?? "").trim();
        const result = passwordSchema.safeParse(fields.password);

        if (!code || !result.success) {
          setState({
            message: "Check the form and try again.",
            fieldErrors: {
              code: code ? undefined : ["Enter the code from your email."],
              password: result.success
                ? undefined
                : result.error.issues.map((issue) => issue.message),
            },
          });
          return;
        }

        try {
          await signIn("password", {
            email: fields.email,
            code,
            newPassword: result.data,
            flow: "reset-verification",
          });
        } catch {
          setState({ message: "That code did not work. Request a new one." });
          return;
        }

        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="text-sm font-semibold text-muted-foreground">
          Project Desk
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">{details.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{details.description}</p>
      </div>

      <form action={submit} className="space-y-5">
        <FieldGroup>
          {showName ? (
            <Field data-invalid={Boolean(state.fieldErrors?.displayName)}>
              <FieldLabel htmlFor="displayName">Your name</FieldLabel>
              <Input id="displayName" name="displayName" autoComplete="name" required />
              {state.fieldErrors?.displayName?.map((error) => (
                <FieldDescription key={error} className="text-destructive">
                  {error}
                </FieldDescription>
              ))}
            </Field>
          ) : null}

          {showEmail ? (
            <Field data-invalid={Boolean(state.fieldErrors?.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" autoComplete="email" required />
              {state.fieldErrors?.email?.map((error) => (
                <FieldDescription key={error} className="text-destructive">
                  {error}
                </FieldDescription>
              ))}
            </Field>
          ) : null}

          {mode === "update" ? (
            <Field data-invalid={Boolean(state.fieldErrors?.code)}>
              <FieldLabel htmlFor="code">Reset code</FieldLabel>
              <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
              <FieldDescription>
                We sent an 8-digit code to {resetEmail ?? "your email"}.
              </FieldDescription>
              {state.fieldErrors?.code?.map((error) => (
                <FieldDescription key={error} className="text-destructive">
                  {error}
                </FieldDescription>
              ))}
            </Field>
          ) : null}

          {showPassword ? (
            <Field data-invalid={Boolean(state.fieldErrors?.password)}>
              <div className="flex items-center justify-between gap-4">
                <FieldLabel htmlFor="password">
                  {mode === "update" ? "New password" : "Password"}
                </FieldLabel>
                {mode === "login" ? (
                  <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                    Forgot password?
                  </Link>
                ) : null}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "login" ? undefined : 8}
                required
              />
              {state.fieldErrors?.password?.map((error) => (
                <FieldDescription key={error} className="text-destructive">
                  {error}
                </FieldDescription>
              ))}
            </Field>
          ) : null}
        </FieldGroup>

        {state.message ? (
          <Alert variant={state.success ? "default" : "destructive"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : null}

        <SubmitButton className="w-full" disabled={pending} pendingLabel="One moment...">
          {pending ? "One moment..." : details.submit}
        </SubmitButton>
      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        {mode === "login" ? (
          <p>
            New here? <Link href="/signup" className="font-medium text-foreground">Create an account</Link>
          </p>
        ) : null}
        {mode === "signup" || mode === "forgot" ? (
          <p>
            Already have an account? <Link href="/login" className="font-medium text-foreground">Sign in</Link>
          </p>
        ) : null}
        {mode === "update" ? (
          <p>
            No code after a minute? <Link href="/forgot-password" className="font-medium text-foreground">Request a new one</Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

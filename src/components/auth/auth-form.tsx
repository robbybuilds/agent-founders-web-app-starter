"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/app/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/action-state";

type Mode = "login" | "signup" | "forgot" | "update";

type AuthFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  mode: Mode;
  nextPath?: string;
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
    description: "We will send a reset link if the account exists.",
    submit: "Send reset link",
  },
  update: {
    title: "Choose a new password",
    description: "Use at least eight characters.",
    submit: "Update password",
  },
};

export function AuthForm({ action, mode, nextPath }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const details = content[mode];
  const showEmail = mode !== "update";
  const showPassword = mode === "login" || mode === "signup" || mode === "update";

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="text-sm font-semibold text-muted-foreground">
          Project Desk
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">{details.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{details.description}</p>
      </div>

      <form action={formAction} className="space-y-5">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

        <FieldGroup>
          {mode === "signup" ? (
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

          {showPassword ? (
            <Field data-invalid={Boolean(state.fieldErrors?.password)}>
              <div className="flex items-center justify-between gap-4">
                <FieldLabel htmlFor="password">Password</FieldLabel>
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

        <SubmitButton className="w-full" pendingLabel="One moment...">
          {details.submit}
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
      </div>
    </div>
  );
}

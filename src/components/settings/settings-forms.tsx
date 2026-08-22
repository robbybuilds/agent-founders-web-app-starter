"use client";

import { useActionState } from "react";

import {
  updateAccountPassword,
  updateProfile,
} from "@/app/(app)/settings/actions";
import { SubmitButton } from "@/components/app/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/action-state";

const initialState: FormState = {};

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, action] = useActionState(updateProfile, initialState);

  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field data-invalid={Boolean(state.fieldErrors?.displayName)}>
        <FieldLabel htmlFor="displayName">Display name</FieldLabel>
        <Input id="displayName" name="displayName" defaultValue={displayName} maxLength={80} />
        <FieldDescription>This is the name shown inside your app.</FieldDescription>
        {state.fieldErrors?.displayName?.map((error) => (
          <FieldDescription key={error} className="text-destructive">
            {error}
          </FieldDescription>
        ))}
      </Field>
      {state.message ? (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <SubmitButton pendingLabel="Saving...">Save profile</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(updateAccountPassword, initialState);

  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field data-invalid={Boolean(state.fieldErrors?.currentPassword)}>
        <FieldLabel htmlFor="settings-current-password">Current password</FieldLabel>
        <Input
          id="settings-current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        {state.fieldErrors?.currentPassword?.map((error) => (
          <FieldDescription key={error} className="text-destructive">
            {error}
          </FieldDescription>
        ))}
      </Field>
      <Field data-invalid={Boolean(state.fieldErrors?.password)}>
        <FieldLabel htmlFor="settings-password">New password</FieldLabel>
        <Input
          id="settings-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <FieldDescription>Use at least eight characters.</FieldDescription>
        {state.fieldErrors?.password?.map((error) => (
          <FieldDescription key={error} className="text-destructive">
            {error}
          </FieldDescription>
        ))}
      </Field>
      {state.message ? (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <SubmitButton pendingLabel="Updating...">Update password</SubmitButton>
    </form>
  );
}

"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/app/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/action-state";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

type ProjectFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project;
};

const initialState: FormState = {};

export function ProjectForm({ action, project }: ProjectFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.name)}>
          <FieldLabel htmlFor="name">Project name</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={project?.name}
            maxLength={100}
            required
          />
          {state.fieldErrors?.name?.map((error) => (
            <FieldDescription key={error} className="text-destructive">
              {error}
            </FieldDescription>
          ))}
        </Field>

        <Field data-invalid={Boolean(state.fieldErrors?.description)}>
          <FieldLabel htmlFor="description">What are you building?</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={project?.description ?? ""}
            maxLength={1000}
            rows={5}
            placeholder="A short description of the person, problem, and outcome."
          />
          <FieldDescription>
            Keep this concrete enough that you can tell whether the project worked.
          </FieldDescription>
          {state.fieldErrors?.description?.map((error) => (
            <FieldDescription key={error} className="text-destructive">
              {error}
            </FieldDescription>
          ))}
        </Field>

        <Field data-invalid={Boolean(state.fieldErrors?.status)}>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "idea"}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="idea">Idea</option>
            <option value="building">Building</option>
            <option value="launched">Launched</option>
          </select>
        </Field>
      </FieldGroup>

      {state.message ? (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <SubmitButton pendingLabel="Saving...">
        {project ? "Save changes" : "Create project"}
      </SubmitButton>
    </form>
  );
}

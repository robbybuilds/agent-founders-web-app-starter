import { z } from "zod";

const descriptionSchema = z
  .string()
  .trim()
  .max(1000, "Use no more than 1,000 characters.")
  .transform((value) => value || null)
  .optional()
  .transform((value) => value ?? null);

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your project a name.")
    .max(100, "Use no more than 100 characters."),
  description: descriptionSchema,
  status: z.enum(["idea", "building", "launched"]),
});

export const projectIdSchema = z.uuid();


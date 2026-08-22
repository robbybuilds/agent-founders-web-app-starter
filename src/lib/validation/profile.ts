import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80, "Use no more than 80 characters.")
    .transform((value) => value || null),
});

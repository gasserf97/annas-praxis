import { z } from "zod";

export type FormState = {
  error?: string;
  fields?: Record<string, string>;
};

export const emptyFormState: FormState = {};

export function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

import { z, ZodError, ZodSchema } from "zod";

export function validateData(schema: ZodSchema, data: z.infer<any>) {
  const validation = schema.safeParse(data);

  if (!validation.success) {
    console.error("Validation Error:", validation.error.flatten());
    throw new ZodError(validation.error.errors);
  }

  return validation.data;
}

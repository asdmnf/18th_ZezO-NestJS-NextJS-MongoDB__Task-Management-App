import { z } from "zod";

const taskValidationSchema = z.object({
  title: z
    .string()
    .max(100, { message: "title must be at most 100 characters" })
    .min(1, { message: "title is required" }),
  description: z.string().min(1, { message: "description is required" }),
  category: z.string().min(1, { message: "category is required" }),
  dueDate: z.preprocess((value) => value, z.coerce.date().min(new Date())),
  completed: z.boolean(),
});

export default taskValidationSchema;

import { z } from "zod";

const loginValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "email is required" }),
  password: z
    .string()
    .max(20, { message: "Password must be at most 20 characters" })
    .min(6, { message: "Password must be at least 6 characters" })
    .min(1, { message: "Password is required" }),
});

export default loginValidationSchema;

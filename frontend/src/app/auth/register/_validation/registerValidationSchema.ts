import { z } from "zod";

const registerValidationSchema = z.object({
  name: z
    .string()
    .max(20, { message: "name must be at most 20 characters" })
    .min(3, { message: "name must be at least 3 characters" })
    .min(1, { message: "name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "email is required" }),
  password: z
    .string()
    .max(20, { message: "password must be at most 20 characters" })
    .min(6, { message: "password must be at least 6 characters" })
    .min(1, { message: "password is required" }),
  password_confirm: z
    .string()
    .max(20, { message: "password_confirm must be at most 20 characters" })
    .min(6, { message: "password_confirm must be at least 6 characters" })
    .min(1, { message: "password_confirm is required" }),
  linkedin_url: z.string().min(1, { message: "linkedin_url is required" }),
});

export default registerValidationSchema;

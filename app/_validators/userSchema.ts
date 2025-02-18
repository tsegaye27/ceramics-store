import { z } from "zod";

const emailField = z.string().email("Invalid email");
const nameField = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters");

export const loginSchema = z.object({
  email: emailField,
  password: z.string(),
});

export const signupSchema = z.object({
  email: emailField,
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: nameField,
  role: z.string().optional(),
});

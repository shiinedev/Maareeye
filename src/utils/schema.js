// signupSchema.ts
import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),  
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signupSchema ;


export const signinSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  

export const transactionSchema = z.object({
  amount: z.number().min().positive(1,"Amount must be a positive number"),
  date: z.date("data is required"),
  description: z.string().optional(),
  category: z.string("category is required"),
  type: z.enum(["income", "expense"]),
  accountId: z.string("accountId is required"),
})




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
  


export const accountSchema = z.object({
  name: z.string().min(2,"Name is required"),
  type: z.enum(["current", "saving"]),
  is_default: z.boolean().optional(),
})

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1,"Amount is required"),
  accountId: z.string("accountId is required"),
  category: z.string("category is required"),
  date: z.date({required_error:"Data is required"}),
  description: z.string().optional(), 
})

export const planSchema = z
  .object({
    type: z.enum(["income", "expense"]),
    amount: z.string().min(1,"Amount is required"),
    accountId: z.string("accountId is required"),
    category: z.string("category is required"),
    date: z.date({required_error:"Data is required"}),
    description: z.string().optional(), 
    is_subscription: z.boolean().default(false),
    subscription_time: z
      .enum(["daily", "weekly", "monthly", "yearly"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_subscription && !data.subscription_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subscription time is required for subscription plan",
        path: ["subscription_time"],
      });
    }
  });



// signupSchema.ts
import { z } from "zod";

export const signinSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  




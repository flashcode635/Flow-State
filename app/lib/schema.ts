import {z} from "zod";

export const SignInSchema = z.object({
    email: z.string().email().min(4).max(25),
    password: z.string().min(6).max(10)
});
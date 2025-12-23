import { z } from "zod";
export const usersigninSchema = z.object({
  username: z.email("invalid email"),
  password: z.string().min(8, "too short").max(16, "too long"),
});
export const usersignupSchema = z.object({
  fname: z.string().min(4, "too short").max(8, "too long"),
  username: z.email("invalid email"),
  password: z.string().min(8, "too short").max(16, "too long"),
});

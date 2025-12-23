import z from "zod";

export const tagSchema = z
  .string()
  .trim()
  .min(1, "tag name is too short")
  .max(16, "tagname is too long");

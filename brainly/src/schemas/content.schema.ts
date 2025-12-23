import z from "zod";

export const contentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "title cannot be empty")
      .max(80, "title is too long"),
    link: z.url("invalid url"),
    contenttype: z.enum(["youtube", "twitter", "note"]),
    tags: z.object({
      tagarr: z
        .array(z.string().trim().min(1, "tag cannot be empty"))
        .max(10, "too many tags")
        .optional(),
    }),
    note: z
      .string()
      .trim()
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z
          .string()
          .min(20, "too few characters")
          .max(1500, "too many characters")
          .optional()
      ),
  })
  .strict();
export const idSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "invalid object id");
export const updatesummarySchema = z.object({
  id: idSchema,
  summary: z.string().trim().max(400, "too many characters for summary"),
});
export const queryquestionSchema = z
  .string()
  .trim()
  .max(100, "too long of a question");

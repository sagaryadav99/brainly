import z from "zod";

export const brainSchema = z.object({ share: z.boolean() });

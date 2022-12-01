import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
});

export const params = z.object({
  noteId: z.string(),
});

export const updateNoteSchema = z.object({
  params,
  body: z
    .object({
      title: z.string(),
      content: z.string(),
    })
    .partial(),
});

export type CreateNoteInput = z.TypeOf<typeof createNoteSchema>;
export type ParamsInput = z.TypeOf<typeof params>;
export type UpdateNoteInput = z.TypeOf<typeof updateNoteSchema>;

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createNoteSchema, params, updateNoteSchema } from "./app.schema";
import {
  createNoteController,
  findAllNotesController,
  deleteNoteController,
  updateNoteController,
} from "./app.controller";

const t = initTRPC.create({
  transformer: superjson,
});
export const appRouter = t.router({
  createNote: t.procedure
    .input(createNoteSchema)
    .mutation(({ input }) => createNoteController({ input })),
  getNotes: t.procedure.query(() => findAllNotesController()),
  deleteNote: t.procedure
    .input(params)
    .mutation(({ input }) => deleteNoteController({ paramsInput: input })),
  updateNote: t.procedure
    .input(updateNoteSchema)
    .mutation(({ input }) =>
      updateNoteController({ paramsInput: input.params, input: input.body })
    ),
});

export type AppRouter = typeof appRouter;

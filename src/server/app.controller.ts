import { TRPCError } from "@trpc/server";
import { CreateNoteInput, ParamsInput, UpdateNoteInput } from "./app.schema";
import myDataSource from "../../config";

import { Note } from "../../entites/Note";

export const createNoteController = async ({
  input,
}: {
  input: CreateNoteInput;
}) => {
  try {
    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
    }
    const note = await myDataSource
      .createQueryBuilder()
      .insert()
      .into(Note)
      .values({
        title: input.title,
        content: input.content,
      })
      .execute();
    return {
      status: "success",
      data: {
        note,
      },
    };
  } catch (error) {
    if (error) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Server error",
      });
    }
    throw error;
  }
};

export const findAllNotesController = async () => {
  try {
    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
    }
    const notes = await myDataSource
      .getRepository(Note)
      .createQueryBuilder("note")
      .getMany();
    return {
      notes,
    };
  } catch (error) {
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
    throw error;
  }
};

export const deleteNoteController = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
    }
    await myDataSource
      .createQueryBuilder()
      .delete()
      .from(Note)
      .where({ id: paramsInput.noteId })
      .execute();
    return {
      status: "success",
    };
  } catch (error) {
    if (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Note with that ID not found",
      });
    }

    throw error;
  }
};

export const updateNoteController = async ({
  paramsInput,
  input,
}: {
  paramsInput: ParamsInput;
  input: UpdateNoteInput["body"];
}) => {
  try {
    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
    }
    const updatedNote = await myDataSource
      .createQueryBuilder()
      .update(Note)
      .set(input)
      .where({ id: paramsInput.noteId })
      .execute();

    return {
      status: "success",
      note: updatedNote,
    };
  } catch (error) {
    if (error) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Note with that title already exists",
      });
    }
    throw error;
  }
};

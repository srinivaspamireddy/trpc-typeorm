import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  id: string;
  title: string;
  content: string;
}
export default function Home() {
  const [form, setForm] = useState<FormData>({
    id: "",
    title: "",
    content: "",
  });

  const { mutate: createNote } = trpc.createNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
      setForm({
        id: "",
        title: "",
        content: "",
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const { data: notes } = trpc.getNotes.useQuery();

  const queryClient = useQueryClient();
  const { mutate: deleteNote } = trpc.deleteNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
      console.log("deleted success");
    },
    onError(error) {
      console.log(error);
    },
  });

  const { mutate: updateNote } = trpc.updateNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
      console.log("Note updated successfully");
      setForm({
        id: "",
        title: "",
        content: "",
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const deleteBtn = (noteId: string) => {
    if (window.confirm("Are you sure")) {
      deleteNote({ noteId: noteId.toString() });
    }
  };

  //  Submit button
  const handleSubmit = async (data: FormData) => {
    try {
      if (form.id === "") {
        createNote(data);
      } else {
        updateNote({ params: { noteId: data.id.toString() }, body: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!notes) return <p>Loading ....</p>;

  return (
    <>
      <div className="mt-10">
        <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
          className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-2 rounded border-gray-600 p-1"
          />

          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="border-2 rounded border-gray-600 p-1"
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-1">
            {form.id === "" ? "ADD +" : "Update"}
          </button>
        </form>
        <div className="w-auto min-w-[40%] max-w-min mx-auto mt-8">
          <table className="border-separate border-spacing-1 border border-slate-500 min-w-[100%] max-w-[100%] table-auto">
            <thead>
              <tr>
                <th className="border border-slate-600 ">SN.</th>
                <th className="border border-slate-600 ">Title</th>
                <th className="border border-slate-600 ">Content</th>
                <th className="border border-slate-600 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {notes.notes.map((note, inx) => (
                <tr key={note.id.toString()}>
                  <td className="border border-slate-600 ">{inx + 1}</td>
                  <td className="border border-slate-600 ">{note.title}</td>
                  <td className="border border-slate-600 ">{note.content}</td>
                  <td className="border border-slate-600 ">
                    <button
                      onClick={() =>
                        setForm({
                          title: note.title,
                          content: note.content,
                          id: note.id.toString(),
                        })
                      }
                      className="bg-blue-500 text-white rounded px-3"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteBtn(note.id.toString())}
                      className="bg-red-500 px-3  text-white rounded"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import {useState} from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";



const createNoteSchema = object({
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
});
type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const  Home = () => {
  const [updateID, setUpdateID] = useState<any>(null);
  const queryClient = useQueryClient();
  // Create
  const { mutate: createNote } = trpc.createNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
      methods.reset({title:"",content:""})
    },
    onError(error) {
      console.log(error);
    },
  });

  // Get
  const { data: notes } = trpc.getNotes.useQuery();

  // Delete
  const { mutate: deleteNote } = trpc.deleteNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
     console.log("deleted success")
    },
    onError(error) {
     console.log(error)
    },
  });

  // Update
  const { mutate: updateNote } = trpc.updateNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"]]);
      console.log("Note updated successfully");
      methods.reset({title:"",content:""})
      setUpdateID(null)
    },
    onError(error) {
      console.log(error);
    },
  });
 
  // zod
  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } =  methods; 

  //  Submit button
  const onSubmitHandler:SubmitHandler<CreateNoteInput> = async (data) =>{
      try {
        if(updateID === null) {
          createNote(data);
        }else{
          updateNote({ params: { noteId: updateID.toString() }, body:data})
        }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete button
  const deleteBtn=(noteId:string)=>{
    if (window.confirm("Are you sure")) {
      deleteNote({ noteId:noteId.toString()});
    }
  }

  if (!notes) return <p>Loading ....</p>;

  return (
    <>
      <div className="mt-10">
        <h1 className="text-center font-bold text-2xl mt-4 mb-4">Notes</h1>
        <form
        onSubmit={handleSubmit(onSubmitHandler)}
          className="w-auto min-w-[28%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        >
          <div>
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className={`border-2 rounded border-gray-600 p-1 ${errors.title && "border-red-500"} min-w-[100%] max-w-min`}
          />
          <p className="text-xs italic text-red-500 mt-2">
            {errors.title?.message}
          </p>
          </div>

          <div>
          <textarea
            placeholder="Content"
            {...register("content")}
            className={`border-2 rounded border-gray-600 p-1 ${errors.content && "border-red-500"} min-w-[100%] max-w-min`}
          />
          <p className="text-xs italic text-red-500 mt-1">
          {errors.content?.message}
          </p>
           </div>

          <button type="submit" className="bg-blue-500 text-white rounded p-1">
            { updateID === null ?"ADD +":"Update"}
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
                      onClick={() =>{
                        setUpdateID(note.id.toString())
                        methods.reset(note)
                      }}
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

export default Home;
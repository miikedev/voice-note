"use client"
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this path is correct
import { motion } from "framer-motion";
import { SubmittedNoteData, useAtom, voiceNoteAtom } from "@/app/store";
import { CategoryBadge } from "./ui/category-badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { deleteNote } from "@/lib/notes";
import DeleteNoteDialog from "@/app/voice/list-server/delete-note-dialog";
import CopyTextButton from "./copy-text-button";
import { DeleteVoiceNoteAtom } from '@/app/store';

type NoteListProps = {
    category: string;
};

const NoteList: React.FC<NoteListProps> = ({ category }: { category: string }) => {

    const [{ data: notes, isPending, error, isError, isSuccess }] = useAtom(voiceNoteAtom)

    const { mutate, isSuccess: isDeleteSuccess } = DeleteVoiceNoteAtom();

    const handleNoteDelete = (noteId: string) => {
        mutate({ noteId })
    }
    console.log('notes', notes)
    if (isPending) return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Render skeletons while loading */}
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-2 p-2 border rounded-2xl shadow-xs bg-white hover:shadow-sm transition"
                >
                    <div className="flex justify-end gap-1">
                    <Skeleton className="h-[1.9rem] w-[10%] rounded-md border border-gray-100" />
                    <Skeleton className="h-[1.9rem] w-[10%] rounded-md border border-gray-100" />
                    <Skeleton className="h-[1.9rem] w-[10%] rounded-md border border-red-300" />
                    </div>
                    <Skeleton className="mt-5 h-[1.3rem] w-full rounded-lg" />
                </div>
            ))}
        </div>
    );

    if (isError) return <div>An error has occurred: {error.message}</div>;

    return (
        <>
            <div className="grid gap-2 md:grid-cols-2">
                {/* Render notes once loading is finished */}
                {isSuccess && notes.data.length !== 0 && notes?.data.map((note: SubmittedNoteData, index) => (
  <motion.div
    key={note._id}
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.25,
      delay: index * 0.09, // 👈 staggered delay
    }}
    className="p-3 border rounded-xl shadow-xs bg-white hover:shadow-sm transition relative"
  >
<p className="text-md font-semibold mt-[2.5rem]">{note.transcribedText}</p>
                        {/* <Badge className="absolute right-[.5rem] top-[.5rem] bg-blue-700 text-white dark:bg-blue-600" variant="secondary">{note.category}</Badge> */}
                        <div className="absolute right-[.5rem] top-[.5rem] flex gap-1">
                            <CopyTextButton text={note.transcribedText ?? ""} />
                            <CategoryBadge category={note.category} />

                            <Button onClick={() => handleNoteDelete(String(note._id))} type="submit" variant={"outline"} size={"sm"} className="p-1 border-red-300">
                                <Trash2 />
                            </Button>
                            {/* <DeleteNoteDialog note={note}/> */}
                        </div>
  </motion.div>
))}
            </div>
            {isSuccess && notes.data.length == 0 && <small className="text-gray-500 text-justify">no data at {category} notes!</small>}
        </>
    );
};

export default NoteList;

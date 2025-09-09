"use client"
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this path is correct
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"
import { noteData, useAtom, voiceNoteAtom } from "@/app/store";

type NoteListProps = {
  category: string;
};

const NoteList: React.FC<NoteListProps> = ({category}: {category: string}) => {

    const [{ data: notes, isPending, error, isError, isSuccess }] = useAtom(voiceNoteAtom)

    if (isPending) return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Render skeletons while loading */}
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-2 p-4 border rounded-2xl shadow-xs bg-white hover:shadow-sm transition"
                >
                    <Skeleton className="h-[12px] w-[80%] rounded-full" />
                    <Skeleton className="mt-2 h-[25px] w-full rounded-lg" />
                    <Skeleton className="mt-1 h-[15px] w-full rounded-lg" />
                </div>
            ))}
        </div>
    );

    if (isError) return <div>An error has occurred: {error.message}</div>;

    return (
        <>
        <div className="grid gap-4 md:grid-cols-2">
            {/* Render notes once loading is finished */}
            {isSuccess && notes.data.length > 0 &&  notes?.data.map((note: noteData) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} // Initial state for animation
                    animate={{ opacity: 1, y: 0 }} // Final state for animation
                    transition={{ duration: 0.5 }} // Animation duration
                    key={note._id}
                    className="p-4 border rounded-2xl shadow-xs bg-white hover:shadow-sm transition relative"
                >
                    <p className="text-md font-semibold mt-[1.1rem]">{note.transcribedText}</p>
                    <Badge variant="default" className="absolute right-[.5rem] top-[.5rem]">{note.category}</Badge>
                </motion.div>
            ))}
        </div>
            {isSuccess && notes.data.length == 0 && <small className="text-gray-500 text-center">no data at {category} notes!</small>}
            </>
    );
};

export default NoteList;

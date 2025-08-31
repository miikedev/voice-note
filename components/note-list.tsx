"use client"
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this path is correct
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query"; // Ensure you installed @tanstack/react-query

// Define the Note type
interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
}

// Dummy notes data
const dummyNotes: Note[] = [
  {
    id: 1,
    title: "Buy groceries",
    content: "Milk, eggs, bread, and fruits.",
    category: "shopping",
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss project milestones and next sprint planning.",
    category: "work",
  },
  {
    id: 3,
    title: "My 2025 Goals",
    content: "Learn AWS, contribute to open source, and improve fitness.",
    category: "personal",
  },
  {
    id: 4,
    title: "Book to Read",
    content: "Start 'Clean Code' by Robert C. Martin.",
    category: "note",
  },
  {
    id: 5,
    title: "Trip Memory",
    content: "Visited Bagan in Myanmar, sunset was unforgettable.",
    category: "memory",
  },
];

// Function to simulate fetching notes data
const fetchNotes = async (): Promise<Note[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyNotes); // Resolve the dummy notes after a delay
    }, 2000); // Simulate a 1-second delay
  });
};

const NoteList: React.FC = () => {
  // Using React Query to fetch notes
  const { isLoading, error, data: notes } = useQuery<Note[], Error>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  if (isLoading) return (
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

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Render notes once loading is finished */}
      {notes?.map((note) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Initial state for animation
          animate={{ opacity: 1, y: 0 }} // Final state for animation
          transition={{ duration: 0.5 }} // Animation duration
          key={note.id}
          className="p-4 border rounded-2xl shadow-xs bg-white hover:shadow-sm transition"
        >
          <span className="text-xs font-medium text-gray-500 uppercase">
            {note.category}
          </span>
          <h3 className="mt-1 text-lg font-semibold">{note.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{note.content}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default NoteList;

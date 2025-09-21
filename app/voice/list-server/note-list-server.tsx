"use server"
import { CategoryBadge } from '@/components/ui/category-badge'
import React from 'react'
import DeleteNoteDialog from './delete-note-dialog'
import { getNotesByEmail } from '@/lib/notes'

const NoteListServer = async() => {
  const notes = await getNotesByEmail({ email: "mokite134@gmail.com" })
    console.log('notes', notes)
  return (
    <div>
        <div className="grid gap-2 md:grid-cols-2">
                  {notes.length !== 0 && notes?.map((note: any) => (
                    <div
                      key={note._id}
                      className="p-3 border rounded-xl shadow-xs bg-white hover:shadow-sm transition relative"
                    >
                      <p className="text-md font-semibold mt-[2.5rem]">{note.transcribedText}</p>
        
                      <CategoryBadge category={note.category} />
        
                      {/* Confirmation dialog wrapper around delete action */}
                      <DeleteNoteDialog note={note} />  
                    </div>
                  ))}
        </div>
    </div>
  )
}

export default NoteListServer
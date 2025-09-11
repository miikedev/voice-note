"use client"
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteNote } from '@/lib/notes';
import { Trash2 } from 'lucide-react';
import { DeleteVoiceNoteAtom, useAtom } from '@/app/store';
type NoteForClient = any

const DeleteNoteDialog: React.FC<{ note: NoteForClient }> = ({ note }) => {
    // We’ll render the confirmation dialog around the delete button.
    // If you want to avoid duplicating forms, this component simply wraps the existing form
    // with a confirmation dialog.
    const [{ mutate, isPending, error, isError, isSuccess }] = useAtom(DeleteVoiceNoteAtom)

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {/* The trigger is the visible delete button */}
                    <Button type="submit" variant="outline" size="sm" className="p-1">
                        <Trash2 />
                    </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    {/* <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this note.
          </AlertDialogDescription> */}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* The user confirms; the form submission will run */}
                    <AlertDialogAction onClick={() => mutate({noteId: String(note._id)})}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteNoteDialog


{/* Use a clickable element that submits the same form */}
                        {/* <form action={mutate} className=""> */}
                            {/* <input type="hidden" name="noteId" value={String(note._id)} /> */}

                            {/* <Button  type="submit" size={"sm"} className="p-1 hover:bg-transparent bg-transparent "> */}
                                {/* <Trash2 className='bg-transparent'/> */}

                                // delete
                            {/* </Button> */}
                        {/* </form> */}
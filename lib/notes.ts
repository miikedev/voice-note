"use server"
import { revalidatePath } from 'next/cache';
import clientPromise from '../lib/mongodb'; // Adjust path if necessary
import { ObjectId } from 'mongodb';
import { queryClient } from '@/app/store';

// async function getNotesByUserId(userId: string): Promise<AudioText[]> {
//     const client = await clientPromise;
//     const db = client.db('voice-note'); // Replace with your database name
//     const collection = db.collection<AudioText>('audio_texts'); // Collection name

//     try {
//         // Fetch notes for the given user_id
//         const notes = await collection.find({ user_id: userId }).toArray();
//         return notes; // Return the retrieved notes
//     } catch (error) {
//         console.error('Error retrieving notes:', error);
//         throw error; // Handle the error appropriately
//     }
// }

const DB_NAME = 'voice-note';
const COLLECTION_NAME = 'audio_texts';

// async function insertNote(note: TranscribedData & { user_id: number }) {
//     try {
//         const client = await clientPromise;
//         const db = client.db(DB_NAME);
//         const collection = db.collection(COLLECTION_NAME);

//         const result = await collection.insertOne({
//             ...note,
//             createdAt: new Date(),
//         });

//         return result.insertedId;
//     } catch (error) {
//         console.error('Error inserting note:', error);
//         throw error;
//     }
// }

export async function getNotesByEmail({ email, sortBy = 'createdAt', order, category }:
    {
        email: string,
        sortBy?: string, // Default sorting field
        order?: string,
        category?: string | null
    },
) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Build the query object
        const query: { email: string; category?: string } = { email };

        // Only filter by category if it's not "all" or null/undefined
        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }

        console.log("Query:", query);


        const notes = await collection.find(query).sort({ [sortBy]: order == 'asc' ? 1 : -1 }).toArray();

        return notes;
    } catch (error) {
        console.error("Error retrieving notes by email:", error);
        throw error;
    }
}



// Usage example
// (async () => {
//     const userId = 'YOUR_USER_ID'; // Replace with the actual user ID
//     try {
//         const notes = await getNotesByUserId(userId);
//         console.log('Retrieved notes:', notes);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

export async function deleteNote(formData: FormData): Promise<void> {
    console.log('hit delete note')
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const noteId = formData.get("noteId")?.toString();

        console.log('note id ', noteId)
        if (!noteId) throw new Error("NoteId is required");

        const result = await collection.deleteOne({ _id: new ObjectId(noteId) });

        if (result.deletedCount === 0) {
            throw new Error("Note not found");
        }

    } catch (error) {
        console.error("Error deleting note:", error);
        throw error; // Let Next.js handle the error
    }
}

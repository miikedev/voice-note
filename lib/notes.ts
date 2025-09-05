import clientPromise from '../lib/mongodb'; // Adjust path if necessary

interface AudioText {
    user_id: string;
    text: string;
    createdAt: Date;
}

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

export async function insertNote(note: TranscribedData & { user_id: number }) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const result = await collection.insertOne({
            ...note,
            createdAt: new Date(),
        });

        return result.insertedId;
    } catch (error) {
        console.error('Error inserting note:', error);
        throw error;
    }
}

export async function getNotesByUserId(userId: number) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const notes = await collection.find({ user_id: userId }).toArray();
        return notes;
    } catch (error) {
        console.error('Error retrieving notes:', error);
        throw error;
    }
}

// Usage example
(async () => {
    const userId = 'YOUR_USER_ID'; // Replace with the actual user ID
    try {
        const notes = await getNotesByUserId(userId);
        console.log('Retrieved notes:', notes);
    } catch (error) {
        console.error('Error:', error);
    }
})();

"use server"
import { revalidatePath } from "next/cache";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

type User = {
    _id: string;
    email?: string;
    image?: string;
    name?: string;
};

const COLLECTION_NAME = 'users';
const DB_NAME = 'voice-note';

export const getUsers = async (): Promise<User[]> => {
    const sortBy = 'createdAt';
    const orderDesc = true; // true for descending

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const users = await collection
            .find({})
            .sort({ [sortBy]: orderDesc ? -1 : 1 })
            .toArray();

        // Normalize to UI/API friendly shape
        return users.map(u => ({
            _id: String(u._id),
            email: u.email ?? '',
            image: u.image ?? undefined,
            name: u.name ?? '',
        }));
    } catch (error) {
        console.error("Error retrieving users account:", error);
        throw error;
    }
};


export async function createUser(formData: FormData): Promise<void> {
    "use server"
    console.log('hit the server component')
    try {
        const client = await clientPromise;
        const db = client.db('voice-note');
        const collection = db.collection('users');
        const email = formData.get('email')
        await collection.insertOne(
            { email, createdAt: new Date() },
            // { $set: { apiKey, updatedAt: new Date() } },
            // { upsert: true }
        );
        revalidatePath("/dashboard/users")

    } catch (error) {
        console.error('Error saving API key:', error);
        throw new Error("Error saving API key")
        // return { success: false, error: 'Failed to save API key' };
    }
}

export type DeleteUserResponse = {
    success: boolean;
    message: string;
};


export async function deleteUser(formData: FormData): Promise<void> {
    try {
        const client = await clientPromise;
        const db = client.db("voice-note");
        const collection = db.collection("users");

        const userId = formData.get("userId")?.toString();

        if (!userId) throw new Error("UserId is required");

        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            throw new Error("User not found");
        }

        revalidatePath("/dashboard/users");
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error; // Let Next.js handle the error
    }
}

/**
 * Stores or updates an API key for a given email in MongoDB.
 * @param email - User's email address
 * @param apiKey - The API key to store
 */
export async function createApiKey(email: string, apiKey: string | null) {
    if (!email || !apiKey) {
        throw new Error("Email and API key are required");
    }
    const client = await clientPromise;
    const db = client.db("voice-note"); // change DB name if needed
    const collection = db.collection("user_keys");

    const result = await collection.updateOne(
        { email },                      // find by email
        { $set: { apiKey } },           // update or insert apiKey
        { upsert: true }                // create if not exists
    );

    return result;
}
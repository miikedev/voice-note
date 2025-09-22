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
        const client = clientPromise;
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
            createdAt: u.createdAt ?? '',
            expiresAt: u.expiresAt ?? ''
        }));

    } catch (error) {
        console.error("Error retrieving users account:", error);
        throw error;
    }
};


export async function createUser(formData: FormData): Promise<void> {
    "use server"
    console.log("hit the server component")
    try {
        const client = clientPromise;
        const db = client.db("voice-note");
        const collection = db.collection("users");

        const email = formData.get("email") as string;
        const durationDays = Number(formData.get("durationDays") || 3); // default 30 days
        const now = new Date();

        // calculate expire date
        const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

        await collection.insertOne({
            email,
            createdAt: now,
            expiresAt,          // ✅ expiration date field
            status: "active",   // optional, easier to filter
        });

        revalidatePath("/dashboard/users");
    } catch (error) {
        console.error("Error saving API key:", error);
        throw new Error("Error saving API key");
    }
}

export async function extendExpiresAt(formData: FormData): Promise<void> {
    "use server";
    console.log("hit the extendExpiresAt func");

    try {
        const client = clientPromise;
        const db = client.db("voice-note");
        const collection = db.collection("users");

        const userId = formData.get("userId")?.toString();

        const extendDays = Number(formData.get("extendDays") || 3); // default +30 days

        // Find user
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        // Current expiresAt or now
        const currentExpiry = user.expiresAt ? new Date(user.expiresAt) : new Date();

        // Extend by given days
        const newExpiry = new Date(currentExpiry.getTime() + extendDays * 24 * 60 * 60 * 1000);

        // Update DB
        await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { expiresAt: newExpiry, updatedAt: new Date() } }
        );

        revalidatePath("/dashboard/users");
    } catch (error) {
        console.error("Error extending expiresAt:", error);
        throw new Error("Error extending expiresAt");
    }
}

export type DeleteUserResponse = {
    success: boolean;
    message: string;
};


export async function deleteUser(formData: FormData): Promise<void> {
    try {
        const client = clientPromise;
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

export async function getApiKey(email: string) {
    try {
        const client = clientPromise;
        const db = client.db("voice-note"); // change DB name if needed
        const collection = db.collection("user_keys");

        const result = await collection.findOne({ email });

        return { apiKey: result?.apiKey };
    } catch (error) {
        console.log('error in get api key, ', error)
    }
}

export async function getExpiredUsers() {
    "use server"
    try {
        const client = clientPromise;
        const db = client.db('voice-note');
        const usersCollection = db.collection('users');

        const now = new Date();
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(now.getDate() + 5);

        // Find users whose expiresAt is in the next 5 days
        const usersExpiring = await usersCollection
            .find({
                expiresAt: { $gte: now, $lte: fiveDaysLater }
            })
            .toArray();
        return usersExpiring || [];
    } catch (error) {
        console.log(error)
    }
}
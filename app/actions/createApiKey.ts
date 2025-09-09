'use server';

import clientPromise from '@/lib/mongodb';

export async function createApiKey(email: string, apiKey: string) {
    try {
        const client = await clientPromise;
        const db = client.db('voice-note');
        const collection = db.collection('api_keys');

        await collection.updateOne(
            { email },
            { $set: { apiKey, updatedAt: new Date() } },
            { upsert: true }
        );

        return { success: true };
    } catch (error) {
        console.error('Error saving API key:', error);
        return { success: false, error: 'Failed to save API key' };
    }
}
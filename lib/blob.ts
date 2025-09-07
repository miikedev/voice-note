import { put, PutBlobResult } from '@vercel/blob';

export async function uploadAudioBlob(file: File): Promise<PutBlobResult> {
    const filename = `voices/capture-${Date.now()}.ogg`;

    return await put(filename, file, {
        access: 'public',
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'audio/ogg',
    });
}
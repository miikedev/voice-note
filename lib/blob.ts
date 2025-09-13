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

export async function getMp3Blob(audioUrl: string): Promise<Blob | null> {
    try {
        const response = await fetch(audioUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const audioBlob = await response.blob();
        return audioBlob;
    } catch (error) {
        console.error("Error fetching or converting audio:", error);
        return null;
    }
}

export function extractYoutubeVideoId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        // Short URL: youtu.be/<id>
        if (parsedUrl.hostname === "youtu.be") {
            // Remove leading '/' and any query string
            return parsedUrl.pathname.slice(1).split("?")[0];
        }

        // Full URL: youtube.com/watch?v=<id>
        if (
            parsedUrl.hostname.includes("youtube.com") ||
            parsedUrl.hostname.includes("www.youtube.com")
        ) {
            return parsedUrl.searchParams.get("v");
        }

        return null; // unsupported URL
    } catch (err) {
        console.error("Invalid URL:", err);
        return null;
    }
}

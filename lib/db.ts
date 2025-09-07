import clientPromise from "@/lib/mongodb";

async function saveTranscription({ data }: { data: any }) {
    const client = await clientPromise;
    const db = client.db("voice-note");

    // Insert data into collection
    const result = await db.collection("audio_texts").insertOne({
        ...data,
        createdAt: new Date(),
    });
    return result;
}

export default saveTranscription;
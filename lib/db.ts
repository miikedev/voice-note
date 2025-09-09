import { SubmittedDataType } from "@/app/store";
import clientPromise from "@/lib/mongodb";

async function saveTranscription({ data }: { data: SubmittedDataType }) {
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
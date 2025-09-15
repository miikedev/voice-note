import { NextRequest, NextResponse } from "next/server";
import { uploadAudioBlob } from "@/lib/blob";
import { transcribeAudio } from "@/lib/transcription";

export async function POST(req: NextRequest) {
    console.info('hit the transcribe route')
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const email = formData.get("email") as string | null;
    const lang = formData.get("lang") as string | null;

    if (!audioFile) {
        return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    try {
        //upload audio to vercel blob
        console.info('uploading audio blob')
        const blob = await uploadAudioBlob(audioFile);

        //make audio file to string base 64 to transcribe
        const audioBytes = await audioFile.arrayBuffer();
        const audioBase64 = Buffer.from(audioBytes).toString("base64");

        //transcribing audio
        const parsedData = await transcribeAudio(lang, blob.url);

        console.log('parsed data', parsedData);
        // logger.info("Saving transcription to database...");
        // await saveTranscription(blob.url, parsedData, email);

        return NextResponse.json({ result: { ...parsedData, audioUrl: blob.url, email } });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to transcribe or store audio." },
            { status: 500 }
        );
    }
}
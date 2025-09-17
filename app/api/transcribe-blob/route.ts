import { NextRequest, NextResponse } from "next/server";
import { uploadAudioBlob } from "@/lib/blob";
import { transcribeAudio } from "@/lib/transcription";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const youtubeUrl = searchParams.get("youtube_url")
        const url = searchParams.get("url") ?? "";
        const q = searchParams.get("quality") ?? "";
        const ext = searchParams.get("ext") ?? "";
        const token = searchParams.get("token") ?? "";
        const lang = searchParams.get("lang") ?? "";

        // const fetchUrl = `${url}&quality=${q}&ext=${ext}&token=${token}`;

        console.log('fetch url', url)
        // if (!url) {
        //     return NextResponse.json({ message: "URL is required" }, { status: 400 });
        // }
        // // 1. Fetch the audio from the given URL
        // const response = await fetch(fetchUrl).then(response => response.arrayBuffer()).then(
        //     (data) => data
        // );

        // if (!response.ok) {
        //     throw new Error(`Failed to fetch audio: ${response}`);
        // }
        // const arrayBuffer = await response.arrayBuffer();

        // const blob = new Blob([response], { type: "audio/mp3" });
        // const file = new File([blob], "audio.mp3", { type: blob.type });

        // // // 2. Create a Vercel Blob client
        // const result = await uploadAudioBlob(file)

        // console.log('result', result)

        const parsedData = await transcribeAudio(lang, url);

        console.log('result', parsedData)

        // 4. Return the uploaded file URL
        return NextResponse.json({
            success: true,
            data: parsedData
        });
    } catch (error: any) {
        console.error("Error uploading audio:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
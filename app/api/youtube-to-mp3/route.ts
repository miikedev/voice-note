// app/api/youtube-to-mp3/route.ts

import { extractYoutubeVideoId } from "@/lib/blob";
import { getMp3Blob, transcribeAudio } from "@/lib/transcription";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url')!;
        const email = searchParams.get('email')!;
        const videoId = extractYoutubeVideoId(url);
        console.log('videoId', videoId)
        console.log('rapid api key', process.env.RAPID_API_KEY)
        const res = await fetch(
            `https://youtube-mp3-2025.p.rapidapi.com/v1/social/youtube/audio?id=${videoId}&quality=128kbps&ext=mp3`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": "youtube-mp3-2025.p.rapidapi.com",
                    "x-rapidapi-key": process.env.RAPID_API_KEY!,
                },
            }
        );

        const data = await res.text();

        // console.log('data in post router mp3', data)
        // return NextResponse.json({ success: true });
        console.log(JSON.parse(data));

        const { title, linkDownload, thumbnail } = JSON.parse(data)

        // console.log(donwload_link)
        // const mp3blob = await getMp3Blob(donwload_link);
        // const parsedData = await transcribeAudio(mp3blob!, 'burmese')

        return NextResponse.json({
            success: true, data: {
                title, linkDownload, thumbnail
            }
        });

    } catch (err) {
        console.error("❌ API Error:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch MP3" }, { status: 500 });
    }
}
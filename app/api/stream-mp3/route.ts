import { NextRequest, NextResponse } from "next/server";
import { slugify } from "../youtube-to-mp3/route";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const linkDownload = searchParams.get('url') ?? '';
    const title = searchParams.get('title') ?? '';
    console.log('download link', linkDownload);

    if (!linkDownload) {
        console.log('linkDownload is not provided')
        throw new Error();
    }

    try {
        const mp3Response = await fetch(linkDownload!);
        if (!mp3Response.ok || !mp3Response.body) {
            throw new Error(`Failed to download MP3 from the direct link.`);
        }

        const safeFilename = slugify(title);
        const filename = `${safeFilename || 'download'}.mp3`;

        // The body is a ReadableStream. Passing it directly is memory-efficient.
        return new NextResponse(mp3Response.body, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mp3',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                // NEW: Add custom headers with the additional data.
                // We must encode the title in case it contains non-ASCII characters.
                'X-Video-Title': encodeURIComponent(title),
            },
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to streamp mp3 ." + error },
            { status: 500 }
        );
    }
}
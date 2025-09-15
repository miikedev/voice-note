import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAtom, useStreamMp3 } from "@/app/store";
import { set } from "zod";
import { slugify } from "@/app/api/youtube-to-mp3/route";
import { Loader } from "./ai-elements/loader";
interface DownloadButtonProps {
    downloadUrl: string;
    title: string;
}

export default function DownloadButton({ downloadUrl, title }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    //   const [{mutate, isPending, isSuccess, data}] = useAtom(useStreamMp3);
    const handleDownload = async (downloadUrl: string) => {
        setLoading(true);

        const res = await fetch(downloadUrl);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        // Access the readable stream
        const reader = res.body?.getReader();
        if (!reader) {
            throw new Error("ReadableStream not supported in this environment");
        }

        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value) {
                chunks.push(value);
                receivedLength += value.length;

                // Optionally show progress (if Content-Length is known)
                const total = Number(res.headers.get("Content-Length")) || 0;
                if (total) {
                    const percentage = Math.round((receivedLength / total) * 100);
                    console.log(`Progress: ${percentage}%`);
                    setPercentage(percentage)
                }
            }
        }

        // Combine all chunks into a Blob
        const blob = new Blob(chunks as BlobPart[]);

        console.log('blob', blob)
        const blobUrl = URL.createObjectURL(blob);

        console.log('blob url', blobUrl)
        // Trigger a download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${slugify(title)}.mp3`; // or parse from headers
        a.click();

        // Clean up
        URL.revokeObjectURL(blobUrl);
        setLoading(false)
        setPercentage(0);
    }
    return (
        <Button
            onClick={() => handleDownload(downloadUrl)}
            disabled={loading}
        >
            {loading ? <span className="flex items-center gap-2"><Loader />{percentage}%</span> : "Download Mp3"}
        </Button>
    );
}
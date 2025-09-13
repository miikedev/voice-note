"use client"; // this makes the component interactive (required for forms)

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { authAtom, mutateUrlAtom, youtubeToMp3Atom } from "@/app/store";
import Image from "next/image";
import { transcribeAudio } from "@/lib/transcription";
import Link from "next/link";
import { motion } from "framer-motion";
const UrlUploadComponent = () => {
    const [data, setData] = useAtom(youtubeToMp3Atom);

    const [authData,] = useAtom(authAtom);

    const [isDownloaded, setIsDownloaded] = useState(false);
    // Form submit handler (client-side)
    //   const handleUrlUpload = async (formData: FormData) => {
    //     const url = formData.get("url") as string;

    //     if (!url) return;

    //     try {
    //       // Call your Next.js API route (app/api/youtube-to-mp3/route.ts)
    //       const res = await fetch("/api/youtube-to-mp3", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ videoUrl: url }),
    //       });

    //       const data = await res.json();
    //       console.log("✅ Response:", data);
    //     } catch (err) {
    //       console.error("❌ Upload error:", err);
    //     }
    //   };

    const [{ mutate,isPending, isSuccess }] = useAtom(mutateUrlAtom);

    const handleUrlUpload = (formData: FormData): void => {
        const url = formData.get("url") as string;
        const email = authData?.user?.email!;

        mutate({ url, email },{
            onSettled: (data) => {
                console.log(data)
                setData({...data})
            }
        })
    }

    const handleTranscribe = async({data}: {data: string}) => {
        console.log('data in handle transcribe', data)
        // const based64blob = await getMp3AsBase64(data);
        // console.log('base 64 blob', based64blob)
        // const parsedData = await transcribeAudio(data.download_link, 'burmese');
        // if(parsedData) setIsDownloaded(false);
        // console.log('parsed data', parsedData)

    }
    console.log('data', data)
    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold">Upload your YouTube URL</h1>
            <form
                action={handleUrlUpload}
                className="flex gap-2 items-center"

            >
                <Input
                    name="url"
                    placeholder="Paste YouTube URL you want to transcribe"
                    className="flex-1"
                />
                <Button type="submit">Upload</Button>
            </form>
            {isPending && <h1 className="my-3">Loading...</h1>}
            {isSuccess && <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="my-10 flex flex-col gap-4 text-center">
                
            <Button onClick={() => handleTranscribe({data: data?.download_link!})} variant="link">
                <div className="mb-4"> {data?.title} </div>
            </Button>
            <div>
            <Image src={data?.thumbnail!} className="rounded-md" width={500} height={500} alt={data?.title!} />
            <div className="flex gap-x-5 my-6 justify-center">
            <Link href={data.download_link}>
            <Button variant="default">
                download
            </Button>
            </Link>
            <Button onClick={() => handleTranscribe({data: data?.download_link!})} variant="default" disabled>
                transcribe (not available)
            </Button>
            </div>
            </div>
            </motion.div>
            }
        </div>
    );
};

export default UrlUploadComponent;
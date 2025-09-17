"use client"; // this makes the component interactive (required for forms)

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { authAtom, mp3Data, downloadMp3Atom, youtubeToMp3Atom, youtubeTranscribeAtom, selectedLanguageAtom, transcribedAtom } from "@/app/store";
import Image from "next/image";
import { motion } from "framer-motion";
import DownloadButton from "./download-mp3-button";
import { Loader } from "./ai-elements/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UrlUploadComponent = () => {
    const router = useRouter();
    const [youtubeUrl, setYoutubeUrl] =useState("")
    const [data, setData] = useAtom<mp3Data>(youtubeToMp3Atom);
    const [{mutate: transcribe, isSuccess: isMutateSuccess, isPending: isMutatePending}] = useAtom(youtubeTranscribeAtom);
    const [authData,] = useAtom(authAtom);
    const [lang,] = useAtom(selectedLanguageAtom)
    const [transcribedData, setTranscribedData] = useAtom(transcribedAtom)

    const [{ mutate, isPending, isSuccess }] = useAtom(downloadMp3Atom);

    const handleUrlUpload = (formData: FormData): void => {
        const url = formData.get("url") as string;
        const email = authData?.user?.email!;
        setYoutubeUrl(url);
        setData({ title: "", thumbnail: "", linkDownload: "" });
        mutate({
            url,
            email,
        },
        {
            onSettled: (data) => {
                if (data) {
                    setData((prev) => ({ ...prev, ...data }));
                }
            },
        });
    };

    const handleTranscribe = async (url: string, lang: string) => {
        console.log('url in handle transcribe', url, lang)
        transcribe({url, lang},{
            onSuccess: (data) => {
                if (data) {
                    setTranscribedData((prev) => ({ ...prev, ...data }));
                    router.push('/voice/edit')
                }
            },
            onError: (error) => {
                toast.error('Err in trancription..')
            }
        })
    }

    console.log('transcribe data', transcribedData)

    console.log('data', data)
    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto py-3 pb-[7rem]">
            <h1 className="text-xl font-bold">Upload your YouTube URL</h1>
            <form action={handleUrlUpload} className="flex gap-2 items-center">
                <Input
                    name="url"
                    placeholder="Paste YouTube URL you want to transcribe"
                    className="flex-1"
                    disabled={isPending} // Disable input while loading
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader /> : "Upload"}
                </Button>
            </form>

            {(data?.title) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="my-5 mb-[4rem] flex flex-col text-center">
                    <h1 className="mb-4 font-medium"> {data?.title} </h1>
                    <div>
                        <Image
                            src={data?.thumbnail || "/next.svg"}
                            className="rounded-md mb-5"
                            width={500}
                            height={500}
                            alt={data?.title ?? "Thumbnail"}
                        />
                        <div className="flex gap-x-3 my-6 justify-center">
                            <DownloadButton downloadUrl={data?.linkDownload!} title={data?.title!} />
                            <Button disabled={isMutatePending} variant="default" onClick={()=>handleTranscribe(youtubeUrl, lang!)}>
                                {isMutatePending ?<span className="flex items-center gap-2"><Loader />Processing</span> : "Transcribe"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* {(isMutateSuccess) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-y-5">
                    <div>
                    <Label className="font-medium mb-3 text-lg">Transcribed Text</Label>
                    <Textarea value={transcribedData.transcribedText} />
                    </div>
                    <div>
                    <Label className="font-medium mb-3 text-lg">Transcribed English Text</Label>
                    <Textarea value={transcribedData.english} />
                    </div>
                </motion.div>
            )} */}
        </div>
    );
};

export default UrlUploadComponent;
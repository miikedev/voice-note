"use client"; // this makes the component interactive (required for forms)

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { authAtom, mp3Data, downloadMp3Atom, youtubeToMp3Atom } from "@/app/store";
import Image from "next/image";
import { motion } from "framer-motion";
import DownloadButton from "./download-mp3-button";
import { Progress } from "./ui/progress";

const UrlUploadComponent = () => {
    const [data, setData] = useAtom<mp3Data>(youtubeToMp3Atom);

    const [authData,] = useAtom(authAtom);

    const [{ mutate, isPending, isSuccess }] = useAtom(downloadMp3Atom);

    const handleUrlUpload = (formData: FormData): void => {
        const url = formData.get("url") as string;
        const email = authData?.user?.email!;

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

    const handleTranscribe = async ({ data }: { data: string }) => {
        console.log('data in handle transcribe', data)
    }
    console.log('data', data)
    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold">Upload your YouTube URL</h1>
            <form action={handleUrlUpload} className="flex gap-2 items-center">
                <Input
                    name="url"
                    placeholder="Paste YouTube URL you want to transcribe"
                    className="flex-1"
                    disabled={isPending} // Disable input while loading
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Loading..." : "Upload"}
                </Button>
            </form>

            {(isSuccess && data?.title) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="my-5 mb-[6rem] flex flex-col text-center">
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
                            <Button variant="default">
                                transcribe (not available)
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default UrlUploadComponent;
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useAtom } from "jotai";
import { authAtom, transcribedAtom } from "@/app/store";
import { useRouter } from "next/navigation";

const voiceNoteFileSchema = z.object({
  audio: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type === "application/ogg",
      {
        message: "Only audio files (including OGG) are allowed",
      }
    )
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: "File must be under 50MB",
    }),
});

const FileUploadComponent = () => {
  const router = useRouter()
  const [transcribedData, setTranscribedData] = useAtom(transcribedAtom)

  const [authData,] = useAtom(authAtom)
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ Validate with Zod
    const parsed = voiceNoteFileSchema.safeParse({ audio: file });
    if (!parsed.success) {
      const errors = JSON.parse(parsed.error.message)
      console.log(errors)
      errors.forEach((e: any) => toast.error(e.message))
    } else {

      try {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("email", String(authData.user.email));
        formData.append("audio", file!, `voice-note-${Date.now()}.ogg`);

        // const response = await fetch("/api/transcribe", {
        //   method: "POST",
        //   body: formData,
        // });

        console.log(formData.getAll('email'))

        await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json()
        }).then((data) => {
          console.log(data)
          setTranscribedData(data.result)
        });

        toast.success("File uploaded successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while uploading.");
      } finally {

        router.push('/voice/edit')
        setIsProcessing(false);
      }
    }

  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="audio"
          type="file"
          onChange={handleFileChange}
          accept="audio/*"
        />
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default FileUploadComponent;
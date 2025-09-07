"use client";
import { voiceNoteSchema, VoiceNoteInput } from '@/app/schema/voiceNote';
import { mutateVoiceNoteAtom, selectedCategoryAtom, submittedDataAtom, SubmittedDataType, transcribedAtom, useAtom } from '@/app/store';
import { CategorySelector } from '@/components/category-selector';
import CopyTextButton from '@/components/copy-text-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { z, ZodError } from "zod";

const Page = () => {
  const router = useRouter();
  const [transcribedData, setTranscribedData] = useAtom(transcribedAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [submittedData, setSubmittedData] = useAtom(submittedDataAtom);
  const [{ mutate, status }] = useAtom(mutateVoiceNoteAtom);

  const handleTranscribedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTranscribedData((prev) => ({
      ...prev,
      burmese: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTranscribedData((prev) => ({
      ...prev,
      editedText: value,
    }));
  };

  const handleSubmit = () => {
    const finalData: VoiceNoteInput = {
      ...transcribedData,
      editedText: transcribedData?.editedText || transcribedData?.burmese,
      category: selectedCategory!,
    };

    // ✅ Validate with Zod
    const parsed = voiceNoteSchema.safeParse(finalData);

    if (!parsed.success) {
      console.log(parsed.error.message)
      const errors = JSON.parse(parsed.error.message)
      console.log(errors)
      errors.forEach((e: any) => toast.error(e.message))
    }

    const dataToSend: SubmittedDataType = {
      ...parsed?.data
    };

    console.log('data', dataToSend)

    try {
      mutate(
        { data: dataToSend },
        {
          onSuccess: () => {
            toast.success("Your voice note has been saved");
            setSubmittedData(dataToSend);
            setTranscribedData({
              burmese: "",
              english: "",
              context: "",
              audioUrl: "",
              email: "",
              editedText: "",
              category: "",
            });
            setSelectedCategory("");
            setTimeout(() => {
              router.push("/voice/list");
            }, 1500);
          },
        }
      );
    } catch (error) {
      toast.error(`Error saving data: ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-15">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Transcribed Text</h1>
          <CopyTextButton text={transcribedData?.burmese || ""} />
        </div>
        <Textarea
          value={transcribedData?.burmese || ""}
          onChange={handleTranscribedChange}
          placeholder="Your transcribed text"
          className="shadow-xs rounded-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Edit</h1>
        <Textarea
          value={transcribedData?.editedText ?? transcribedData?.burmese}
          onChange={handleEditChange}
          placeholder="Your edited text"
          className="shadow-xs rounded-sm"
        />
      </div>

      <div>
        <CategorySelector />
      </div>

      <div>
        <Button className="w-full" onClick={handleSubmit}>
          {status === "pending" ? "Saving..." : status === "success" ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
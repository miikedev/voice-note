"use client";
import { selectedCategoryAtom, submittedDataAtom, transcribedAtom, useAtom } from '@/app/store';
import { CategorySelector } from '@/components/category-selector';
import CopyTextButton from '@/components/copy-text-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { toast } from 'sonner';

const Page = () => {
  const [transcribedData, setTranscribedData] = useAtom(transcribedAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [submittedData , setSubmittedData] = useAtom(submittedDataAtom);

  const validateTranscribedText = (value: string) => {
    if (!value || value.trim() === '') {
      return "Transcribed text is required.";
    }
    return '';
  };

  const validateEditedText = (value: string) => {
    if (!value || value.trim() === '') {
      return "Edited text is required.";
    }
    return '';
  };

  const validateCategorySelection = (value: string) => {
    if (!value) {
      return "Please select a category.";
    }
    return '';
  };

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
      editedText: value, // ✅ store edited text properly
    }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  console.log('type of transcribed data', typeof transcribedData)
  const handleSubmit = () => {
    const transcriptionErr = validateTranscribedText(transcribedData?.burmese || '');
    const editedErr = validateEditedText(transcribedData?.editedText || '');
    const categoryErr = validateCategorySelection(selectedCategory ?? '');

    if (transcriptionErr) return toast.warning(transcriptionErr);
    if (editedErr) return toast.warning(editedErr);
    if (categoryErr) return toast.warning(categoryErr);

    // ✅ Save final data
    setSubmittedData({
      ...(transcribedData || {}),
      burmese: transcribedData?.editedText,
      category: selectedCategory,
    });

    // call api to store updated data
    toast.success("Data saved successfully!");
  };

  console.log('submitted data', submittedData)

  return (
    <div className='flex flex-col gap-6 px-5 py-15'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <h1 className='text-xl font-semibold'>Transcribed Text</h1>
          <CopyTextButton text={transcribedData?.burmese || ''} />
        </div>
        <Textarea
          value={transcribedData?.burmese || ''}
          onChange={handleTranscribedChange}
          placeholder='Your transcribed text'
          className='shadow-xs rounded-sm'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>Edit</h1>
        <Textarea
          value={transcribedData?.editedText ?? transcribedData?.burmese}
          onChange={handleEditChange}
          placeholder='Your edited text'
          className='shadow-xs rounded-sm'
        />
      </div>

      <div>
        <CategorySelector onCategoryChange={handleCategoryChange} />
      </div>

      <div>
        <Button className='w-full' onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

export default Page;
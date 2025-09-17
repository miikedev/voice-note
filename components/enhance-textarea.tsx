"use client";

import React, { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useCompletion } from '@ai-sdk/react';
import { Loader } from './ai-elements/loader';

const EnhanceTextarea = () => {
  // 1. State for the user's input text
  const [text, setText] = useState("transcribed text");

  // 2. useCompletion hook setup
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/enhance',
  });

  // 3. This effect updates the textarea when the completion is finished
  // useEffect(() => {
  //   if (completion) {
  //     setText(completion);
  //   }
  // }, [completion]);


  // 4. Client-side submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission
    await complete(text); // Pass the current text to the AI
  };

  return (
    <div className='flex flex-col gap-y-3 m-2'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-3'>
        <div className='flex justify-end'>
          {/* 5. Use the isLoading state from the hook */}
          <Button type='submit' className='w-[6rem]' disabled={isLoading}>
            {isLoading ? "Enhancing..." : "Enhance"}
          </Button>
        </div>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          name="textContent"
          rows={5}
        />
      </form>
      {/* You can keep this for debugging or remove it if the textarea updates */}
      <p className='text-sm text-gray-500'>Completion Result: {completion}{isLoading && !completion && <Loader />}</p>
    </div>
  );
};

export default EnhanceTextarea;
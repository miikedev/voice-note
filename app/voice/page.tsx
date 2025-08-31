import { DurationSelector } from '@/components/duration-selector';
import { LanguageSelector } from '@/components/language-selector';
import VoiceRecorder from '@/components/voice-recorder';
import React from 'react';

const Page = () => {

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <VoiceRecorder />
      <div className='flex gap-6 mt-5'>
        <LanguageSelector />
        <DurationSelector />
      </div>
    </div>
  );
};

export default Page;
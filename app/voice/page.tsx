import { DurationSelector } from '@/components/duration-selector';
import { LanguageSelector } from '@/components/language-selector';
import VoiceRecorder from '@/components/voice-recorder';
import React from 'react';

const Page = () => {

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex gap-3 mt-[2.5rem]'>
        <LanguageSelector />
        <DurationSelector />
      </div>
      <div className='absolute transform translate-y-124'>
      <VoiceRecorder />
      </div>
    </div>
  );
};

export default Page;
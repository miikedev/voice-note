import { DurationSelector } from '@/components/duration-selector';
import { LanguageSelector } from '@/components/language-selector';
import VoiceRecorder from '@/components/voice-recorder';
import { useSession } from 'next-auth/react';
import React from 'react';

const Page = () => {

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <VoiceRecorder />
      <div className='absolute top-5 flex gap-3 mt-[4rem]'>
        <LanguageSelector />
        <DurationSelector />
      </div>
    </div>
  );
};

export default Page;
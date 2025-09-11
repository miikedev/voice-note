import { DurationSelector } from '@/components/duration-selector'
import FileUploadComponent from '@/components/file-upload-component'
import { LanguageSelector } from '@/components/language-selector'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='absolute transform translate-y-84'>
        <div className="font-bold text-2xl">Transcribe Your Audio File</div>
        <div className='w-82 min-w-86 mx-auto my-[2rem]'>
          <LanguageSelector />
          <div className='my-3'></div>
          <FileUploadComponent />
        </div>
      </div>
    </div>
  )
}

export default Page
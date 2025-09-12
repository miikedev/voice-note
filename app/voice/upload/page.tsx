import { DurationSelector } from '@/components/duration-selector'
import FileUploadComponent from '@/components/file-upload-component'
import { LanguageSelector } from '@/components/language-selector'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='transform translate-y-40'>
        <div className="font-semibold text-2xl">Transcribe Your Audio File</div>
        <div className='w-82 min-w-86 mx-auto my-[1.4rem]'>
          <LanguageSelector className="w-full"/>
          <div className='my-4'></div>
          <FileUploadComponent />
        </div>
      </div>
    </div>
  )
}

export default Page
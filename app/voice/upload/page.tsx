import { DurationSelector } from '@/components/duration-selector'
import FileUploadComponent from '@/components/file-upload-component'
import { LanguageSelector } from '@/components/language-selector'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex gap-3 mt-[2.5rem]'>
              <LanguageSelector />
              <DurationSelector />
            </div>
    <div className='text-center mt-[5rem] px-[1.5rem]'>
        <div className="font-bold text-2xl">Upload Page</div>
        <div className='w-82 min-w-86 mx-auto my-[2rem]'>
        <FileUploadComponent />
        </div>
    </div>
    </div>
  )
}

export default Page
import FileUploadComponent from '@/components/file-upload-component'
import React from 'react'

const Page = () => {
  return (
    <div className='text-center mt-[5rem] px-[1.5rem]'>
        <div className="font-bold text-2xl">Upload Page</div>
        <div className='w-82 min-w-86 mx-auto my-[2rem]'>
        <FileUploadComponent />
        </div>
    </div>
  )
}

export default Page
import { CategorySelector } from '@/components/category-selector'
import CopyTextButton from '@/components/copy-text-button'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col gap-6 px-5 py-15'>
      <div className='flex flex-col gap-2'>
      <h1 className='text-xl font-semibold'>Transcribed Text</h1>
      <Textarea placeholder='Your transcribed text' className='shadow-xs rounded-sm' />
      </div>
      <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
      <h1 className='text-xl font-semibold'>Edit</h1>
      <CopyTextButton text="copied text" />
      </div>
      <Textarea placeholder='Your edited text' className='shadow-xs rounded-sm' />
      </div>
      <div>
        <CategorySelector />
      </div>
      <div>
        <Button className='w-full'>Save</Button>
      </div>
    </div>
  )
}

export default Page
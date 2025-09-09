"use client"
import { selectedCategoryAtom } from '@/app/store'
import { CategorySelector } from '@/components/category-selector'
import NoteList from '@/components/note-list'
import NoteSearchInput from '@/components/note-search-input'
import ToggleUpDownButton from '@/components/toggle-up-down-button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React from 'react'

const client = new QueryClient();
const Page = () => {
  const [category,] = useAtom(selectedCategoryAtom);
  return (
    <QueryClientProvider client={client}>
    <div className='w-full'>
      <div className='w-[95%] lg:w-[60%] flex flex-col gap-3 mx-auto'>
        <h1 className='text-2xl font-semibold'>History</h1>
        <div className='flex gap-3 items-center'>
        <CategorySelector />
        <ToggleUpDownButton />
        </div>
        <NoteSearchInput />
        <NoteList category={category}/>
        </div>
    </div>
    </QueryClientProvider>
  )
}

export default Page
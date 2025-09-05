"use client"
import { CategorySelector } from '@/components/category-selector'
import NoteList from '@/components/note-list'
import NoteSearchInput from '@/components/note-search-input'
import { Button } from '@/components/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import React from 'react'

const client = new QueryClient();
const Page = () => {
  return (
    <QueryClientProvider client={client}>
    <div className='flex flex-col gap-3 px-5 mt-[3rem]'>
        <h1 className='text-2xl font-semibold'>History</h1>
        <div className='flex gap-3 items-center'>
        <CategorySelector />
        <Button variant={"ghost"} className=''>
        <ArrowUpDownIcon />
        </Button>
        </div>
        <NoteSearchInput />
        <NoteList />
    </div>
    </QueryClientProvider>
  )
}

export default Page
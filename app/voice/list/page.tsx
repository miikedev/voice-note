"use client"
import { CategorySelector } from '@/components/category-selector'
import NoteList from '@/components/note-list'
import NoteSearchInput from '@/components/note-search-input'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const client = new QueryClient();
const Page = () => {
  return (
    <QueryClientProvider client={client}>
    <div className='flex flex-col gap-3 px-5 py-15'>
        <h1 className='text-2xl font-semibold'>History</h1>
        <CategorySelector />
        <NoteSearchInput />
        <NoteList />
    </div>
    </QueryClientProvider>
  )
}

export default Page
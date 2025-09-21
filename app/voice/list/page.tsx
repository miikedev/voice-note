"use client"
import { authAtom, selectedCategoryAtom, toggleAtom } from '@/app/store'
import { CategorySelector } from '@/components/category-selector'
import NoteList from '@/components/note-list'
import NoteSearchInput from '@/components/note-search-input'
import ToggleUpDownButton from '@/components/toggle-up-down-button'
import { Toggle } from '@radix-ui/react-toggle'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { ArrowUpDown } from 'lucide-react'
import React, { useTransition } from 'react'

const client = new QueryClient();

const Page = () => {
  const [category,] = useAtom(selectedCategoryAtom);
  const [toggle, setToggle] = useAtom(toggleAtom)
  const [isPending, startTransition] = useTransition();

  return (
    <QueryClientProvider client={client}>
      <div className='w-full h-screen'>
        <div className='w-[95%] lg:w-[60%] flex flex-col gap-3 mx-auto transform translate-y-10'>
          <h1 className='text-2xl font-semibold'>History</h1>
          <div className='flex items-center gap-3'>
            <CategorySelector />
            <Toggle pressed={toggle} onClick={() => {
                setToggle(prev => !prev)
              }} aria-label="Toggle italic">
              <ArrowUpDown className="h-4 w-4" />
            </Toggle>
          </div>
          {/* <NoteSearchInput /> */}
          {
            <NoteList category={category} isTransitionPending={isPending}/>
          }
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default Page
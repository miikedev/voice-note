"use server"
import NoteListServer from "./note-list-server";
import NoteSearchInput from "@/components/note-search-input";
import ToggleUpDownButton from "@/components/toggle-up-down-button";
import { CategorySelector } from "@/components/category-selector";
import { useAtom } from "jotai";
import { selectedCategoryAtom } from "@/app/store";

const Page = () => {
  return (
    <div className='w-full'>
      <div className='w-[95%] lg:w-[60%] flex flex-col gap-3 mx-auto'>
        <h1 className='text-2xl font-semibold'>History</h1>
        <div className='flex gap-3 items-center'>
        <CategorySelector />
        <ToggleUpDownButton />
        </div>
        <NoteSearchInput />
        <NoteListServer />
        </div>
    </div>
  )
}

export default Page
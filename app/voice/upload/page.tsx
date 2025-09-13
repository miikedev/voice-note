import FileUploadComponent from '@/components/file-upload-component'
import { LanguageSelector } from '@/components/language-selector'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import React from 'react'
import { FileAudio } from 'lucide-react'
import YoutubeIcon from '@/components/icons/youtube-icon'
import UrlUploadComponent from '@/components/url-upload-component'

const Page = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='transform translate-y-40 w-96'>
        <Tabs defaultValue='file' className=''>
          <TabsList className='h-[3rem] w-[6rem]'>
          <TabsTrigger value="file"><FileAudio /></TabsTrigger>
          <TabsTrigger value="youtube"><YoutubeIcon /></TabsTrigger>
        </TabsList>
        <TabsContent value="file">
        <div className='w-96 min-w-86 mx-auto my-[1.4rem]'>
          <LanguageSelector className="w-full"/>
          <div className='my-4'></div>
          <FileUploadComponent />
        </div>
        </TabsContent>
        <TabsContent value="youtube">
        <div className='w-96 min-w-86 mx-auto my-[1.4rem]'>
          <UrlUploadComponent />
        </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Page
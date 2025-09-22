'use server'
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
import { getApiKey } from '@/lib/users'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Page = async() => {
  const session = await getServerSession(authOptions);
  console.log('email from server session', session)
  const result = await getApiKey(session?.user?.email!)
  console.log('result in upload page', result)
  return (
    <div className='flex flex-col justify-center items-center w-full mt-[4rem]'>
      <div className='px-[1rem]'>
        <Tabs defaultValue='file'>
          <TabsList className='h-[2.8rem] w-[5.6rem]'>
          <TabsTrigger value="file"><FileAudio /></TabsTrigger>
          <TabsTrigger value="youtube"><YoutubeIcon /></TabsTrigger>
        </TabsList>
        <TabsContent value="file">
        <div className='w-96 min-w-86 mt-[1rem]'>
          <LanguageSelector className="w-full"/>
          <div className='my-4'></div>
          <FileUploadComponent />
        </div>
        </TabsContent>
        <TabsContent value="youtube">
        <div className='w-96 min-w-86'>
          <UrlUploadComponent apiKey={result?.apiKey!} />
        </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Page
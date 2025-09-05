'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Mic, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PageNavs = () => {
    const router = useRouter()
    return (
        <div className=''>
            <Tabs defaultValue="account" className="">
                <TabsList className='h-[5rem] w-[15rem] rounded-3xl'>
                    <TabsTrigger value="voice" onClick={()=>router.push('/voice')}>
                        <Mic />
                    </TabsTrigger>
                    <TabsTrigger value="upload" onClick={()=>router.push('/voice/upload')}>
                        <Upload />
                    </TabsTrigger>
                    <TabsTrigger value="history" onClick={()=>router.push('/voice/list')}>
                        <History />
                    </TabsTrigger>
                </TabsList>
                {/* <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent> */}
            </Tabs>
        </div>
    )
}

export default PageNavs
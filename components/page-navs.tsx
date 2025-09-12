'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Mic, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PageNavs = () => {
    const router = useRouter()
    return (
        <div className="flex justify-center">
            <Tabs defaultValue="account" className="bg-transparent">
                <TabsList className='h-[5rem] w-[15rem] rounded-xl flex gap-1 backdrop-blur-sm bg-white/20 border border-white/20'>
                    <TabsTrigger 
                        className='opacity-80 text-black bg-white/20 hover:bg-white/40 rounded-lg transition duration-200' 
                        value="voice" 
                        onClick={() => router.push('/voice')}
                    >
                        <Mic className='text-black'/>
                    </TabsTrigger>
                    <TabsTrigger 
                        className='opacity-80 text-black bg-white/20 hover:bg-white/40 rounded-lg transition duration-200' 
                        value="upload" 
                        onClick={() => router.push('/voice/upload')}
                    >
                        <Upload className='text-black'/>
                    </TabsTrigger>
                    <TabsTrigger 
                        className='opacity-80 text-black bg-white/20 hover:bg-white/40 rounded-lg transition duration-200' 
                        value="history" 
                        onClick={() => router.push('/voice/list')}
                    >
                        <History className='text-black'/>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}

export default PageNavs

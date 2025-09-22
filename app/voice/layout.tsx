"use client"
import PageNavs from '@/components/page-navs';
import Setting from '@/components/setting';
import { Button } from '@/components/ui/button';

import { LogOutIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to resolve

    // Redirect to /login if NOT authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  return (

    <div className="flex flex-col h-screen">
      <div className="sticky flex items-center justify-end top-[1.2rem] pr-4 z-50 gap-3">
        <Button size={"icon"} onClick={() => signOut()}>
          <LogOutIcon />
        </Button>
        <Setting />
        <Avatar className='w-9 h-9 rounded-md'>
          <AvatarImage src={data?.user?.image!} width={75} height={75} />
          <AvatarFallback className='text-white bg-black'>
            {data?.user?.name
              ?.split(" ")                   // split by space
              .map((word) => word[0])        // take first letter of each word
              .join("")                      // join together (e.g. "John Doe" → "JD")
              .toUpperCase()}               
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow">
        {children}
      </div>
      <div className="fixed bottom-10 left-0 right-0 flex justify-center">
        <PageNavs />
      </div>
    </div>

  );
}
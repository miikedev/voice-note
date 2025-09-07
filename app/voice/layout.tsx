"use client"
import PageNavs from '@/components/page-navs';
import { Button } from '@/components/ui/button';
import { LogOut, LogOutIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
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
    <div className="sticky flex justify-end top-[1.2rem] px-5 z-50">
        <Button onClick={() => signOut()}>
            <LogOutIcon />
        </Button>
    </div>
    <div className="flex-grow">
        {children}
    </div>
    <div className="sticky flex justify-center bottom-[5rem]">
        <PageNavs />
    </div>
</div>

  );
}
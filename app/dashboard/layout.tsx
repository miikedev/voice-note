"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Provider } from 'jotai'
import { LogOut, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
    <Provider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
            <Button size={"icon"} onClick={() => signOut({ callbackUrl: "/login" })} >
                      <LogOutIcon />
                    </Button>
        </header>
        <main className="px-5">
        {children}
        </main>
      </SidebarInset>
      </SidebarProvider>
    </Provider>
    );
}
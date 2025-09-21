import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Provider } from 'jotai'
import { LogOut, LogOutIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LogoutButton from "@/components/logout-button";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const admins = (process.env.ADMINS)?.split(",") ?? ['maungdevv@gmail.com', 'zinwaiyan274@gmail.com'];
  // check session and admin

  console.log('admins', admins)
  if (!session || !admins.includes(session.user?.email || "")) {
    redirect("/"); // kick out if not logged in or not admin
  }
  
  return (
    <Provider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Button size={"icon"} onClick={() => {
              'use server'
              signOut({ callbackUrl: "/login" })
            }} >
              <LogOutIcon />
            </Button> */}
            <LogoutButton />
          </header>
          <main className="px-5">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
}
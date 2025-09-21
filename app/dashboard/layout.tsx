import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Provider } from 'jotai'
import { LogOut, LogOutIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log('dashboard session', session);
  if (session?.user?.email !== 'maungdevv@gmail.com') {
    redirect("/"); // ✅ kick out if not logged in
  }
  return (
    <Provider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Button size={"icon"} onClick={async () => {
              "use server"
              await signOut({ callbackUrl: "/login" })
            }} >
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
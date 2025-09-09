import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Provider } from 'jotai'

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
        </header>
        <main className="px-5">
        {children}
        </main>
      </SidebarInset>
      </SidebarProvider>
    </Provider>
    );
}
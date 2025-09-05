"use client"; 
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import GoogleIcon from "@/components/icons/google-icon";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname', pathname)

  useEffect(() => {
    if (status === "loading") return; // wait for session to resolve

    // Redirect to /login if NOT authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading spinner while session is being checked
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }
  console.log('session', session)
  // If authenticated, show the main content
  if (status === "authenticated") {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="font-bold">Welcome, {session.user?.name || "User"} 🎉</h1>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button onClick={() => signOut() }>
            <GoogleIcon />
            Sign Out
          </Button>
        </main>
      </div>
    );
  }

  // Fallback (in case status is unauthenticated, redirecting already)
  return null;
}
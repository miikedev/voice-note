"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { authAtom } from "../store";
import { Notebook, NotebookText } from "lucide-react";

const LoadingMessage = () => (
  <p className="mt-5 text-xl font-semibold">Please wait...</p>
);

const LoginPage = () => {
  const [, setAuth] = useAtom(authAtom);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // ✅ only set auth & redirect if session is truly valid
      setAuth({
        user: {
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          image: session.user.image ?? "",
        },
        expires: session.expires,
      });
      router.push("/voice");
    }
  }, [status, session, router, setAuth]);

  const handleSignIn = useCallback(async () => {
    const result = await signIn("google", { redirect: false });
    if (result?.error) {
      console.error("❌ Sign-in failed:", result.error);
    }
    // ✅ don’t push here, let `useEffect` handle valid redirect
  }, []);

  return (
    <div className="flex flex-col justify-center h-screen gap-5 px-6">
      <div className="w-96 mx-auto flex flex-col gap-2">
        <div className="w-96">
          <h1 className="text-5xl mb-3 font-extrabold">Voice Note App</h1>
          {/* <h3 className="text-xl mb-2 font-regular">Login to your account</h3> */}
          <div className="ml-1 text-xl font-bold">
            <span className="text-4xl font-medium">W</span><span className="inline relative right-1">elcome to New Note-taking 
              <span className="text-3xl relative left-3 font-medium">E</span>
              <span className="inline relative left-3">ra</span>
                </span> <NotebookText size={32} className="inline bottom-2 relative left-2" />
          </div>
        </div>
        <Button size='lg' onClick={handleSignIn} className="rounded mt-2 w-[15rem] text-lg">
          <GoogleIcon /> Sign in with Google
        </Button>
        {status === "loading" && <LoadingMessage />}
      </div>
    </div>
  );
};

export default LoginPage;
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
    <div className="flex flex-col justify-center h-screen gap-8 px-4 sm:px-6">
      <div className="mx-auto flex flex-col gap-4 w-full max-w-md">
        <div className="">
          <h1 className="text-5xl sm:text-4xl md:text-5xl mb-3 font-extrabold">
            Voice Note App
          </h1>

          <div className="ml-0 text-lg sm:text-xl font-bold leading-snug">
            <span className="text-2xl sm:text-3xl md:text-4xl font-medium">W</span>
            <span className="inline relative right-[.18rem]">
              elcome to New Note-taking
              <span className="text-xl sm:text-2xl md:text-3xl relative left-2 font-medium">
                E
              </span>
              <span className="inline relative left-2">ra</span>
            </span>
            <NotebookText
              size={28}
              className="inline bottom-1 sm:bottom-2 relative left-2"
            />
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleSignIn}
          className="rounded mt-2 w-full sm:w-[15rem] text-base sm:text-lg"
        >
          <GoogleIcon /> Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
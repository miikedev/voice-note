// app/login/page.tsx

"use client"; // Ensure this is a client component

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { authAtom } from '../store';
const LoadingMessage = () => (
    <p className='mt-5 text-xl font-semibold'>Please wait...</p>
);

const LoginPage = () => {
    const [, setAuth] = useAtom(authAtom)
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session) {
            // Make sure session exists before spreading
            setAuth({
               user: {
                name: session?.user?.name ?? "",
                email: session?.user?.email ?? "",
                image: session?.user?.image ?? "",
      },
      expires: session.expires,
            });
            router.push("/voice");
        }
    }, [status, session, router, setAuth]);

    // Handle sign in
    const handleSignIn = useCallback(async () => {
        try {
            const result = await signIn('google', { redirect: false });
            if (result?.error) {
                console.error(result.error);
            } else {
                // Redirect to voice page after successful login
                router.push('/voice');
            }
        } catch (error) {
            console.error(error);
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl mb-4 font-bold">Voice Note App</h1>
            <h3 className='text-xl mb-5 font-semibold'>Login</h3>
            <Button onClick={handleSignIn} className="px-5 py-3 rounded">
                <GoogleIcon /> Sign in with Google
            </Button>
            {status === 'loading' && <LoadingMessage />}
        </div>
    );
};

export default LoginPage;

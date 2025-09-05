// app/login/page.tsx

"use client"; // Make sure this is a client component

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // Redirect user to homepage if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/voice'); // Redirect to the voice page
        }
    }, [status, router]);

    const handleSignIn = async () => {
        try {
            
            const result = await signIn('google', { redirect: false }); // Change to redirect: false
            console.log(result);
            if (result?.error) {
                console.error(result.error); // Handle error if sign-in fails
            } else {
                // Redirect to voice page after successful login
                router.push('/voice');
            }
        } catch (error) {
            console.error(error)
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl mb-4 font-bold">Voice Note App</h1>
            <h3 className='text-xl mb-5 font-semibold'>Login</h3>
            <Button
                onClick={handleSignIn}
                className="px-5 py-3 rounded"
            >
                <GoogleIcon /> Sign in with Google
            </Button>
            {status === 'loading' && <p className='mt-5 text-xl font-semibold'>Please wait...</p>}
        </div>
    );
};

export default LoginPage;

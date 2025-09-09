import { ArrowLeft } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Page = () => {
  return (
    <div className="h-screen bg-black flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-96 h-[20rem] w-full text-center">
        <div className="mb-6 mt-6">
          <h1 className="text-3xl font-bold mb-2">Authentication Failed</h1>
          <p className="text-gray-600 text-sm">
            Oops! We couldn’t log you in. Please check your credentials and try again.
          </p>
        </div>
        <div className='mt-9'>
        <Link href="/login" passHref>
          <Button size={"lg"} className="flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-md transition">
            <ArrowLeft size={20} />
            Back to Login
          </Button>
        </Link>
        <p className="mt-4 text-gray-400 text-sm">
          Need help? Contact support.
        </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
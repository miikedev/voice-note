"use server"
import VoiceRecorder from '@/components/voice-recorder';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getApiKey } from '@/lib/users';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Setting from '@/components/setting';
import Link from 'next/link';
import { Eye, EyeOff, KeyIcon } from 'lucide-react';

const Page = async () => {
  const session = await getServerSession(authOptions);
  const result = await getApiKey(session?.user?.email!)
  console.log('apikey', result?.apiKey)

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='absolute transform translate-y-84'>
        <VoiceRecorder apiKey={result?.apiKey!} />
      </div>
    </div>
  );
};

export default Page;


  // if (!result?.apiKey) {
  //   return <Dialog open={!result?.apiKey}>
  //     <DialogContent>
  //       <form className="sm:max-w-md flex flex-col gap-3">
  //         <DialogHeader className="text-left">
  //           <DialogTitle>
  //             <KeyIcon className="inline mx-1" />
  //             API Key
  //           </DialogTitle>
  //         </DialogHeader>

  //         <div className="flex items-center gap-2">
  //           <div className="grid flex-1 gap-2">
  //             <Label htmlFor="apikey" className="sr-only">
  //               API Key
  //             </Label>
  //             <div className="relative"> {/* Make the parent element relative */}
  //               <Input
  //                 id="apikey"
  //                 // value={apiKey}
  //                 name="key"
  //                 // onChange={(e) => setApiKey(e.target.value)}
  //                 // type={isVisible ? 'text' : 'password'} // Toggle input type
  //                 placeholder="Enter your API key"
  //                 className="pr-1 text-xs" // Add padding to prevent icon overlap
  //               />
  //               <button
  //                 type="button"
  //                 // onClick={toggleVisibility}
  //                 className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent" // Position the icon
  //               >
  //                 {/* {!isVisible ? <EyeOff className="text-gray-500"/> : <Eye className="text-gray-500"/>} Toggle between icons */}
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         <DialogDescription>
  //           Need an API key?
  //           Get your free Gemini API key from
  //           <Link
  //             href="https://aistudio.google.com/app/apikey"
  //             target="blank"
  //             className="text-blue-500 underline ml-2"
  //           >
  //             Google AI Studio
  //           </Link>
  //         </DialogDescription>

  //         <DialogFooter>
  //           <Button type="submit" variant="default">
  //             {/* {saveStatus === "saving" ? "Saving..." : "Save"} */}
  //             Save
  //           </Button>
  //           <Button
  //             type="button"
  //             variant="secondary"
  //           // onClick={handleTestKey}
  //           // disabled={status === "testing"}
  //           >
  //             {/* {status === "testing" ? "Testing..." : "Test API Key"} */}
  //             Test API Key
  //           </Button>
  //         </DialogFooter>

  //         {/* {status === "success" && (
  //                   <p className="text-green-600 text-sm mt-2">✅ API Key works!</p>
  //               )}
  //               {status === "error" && (
  //                   <p className="text-red-600 text-sm mt-2">❌ Invalid API Key.</p>
  //               )}
  //               {saveStatus === "success" && (
  //                   <p className="text-green-600 text-sm mt-2">✅ API Key saved!</p>
  //               )}
  //               {saveStatus === "error" && (
  //                   <p className="text-red-600 text-sm mt-2">❌ Error in Saving API Key.</p>
  //               )} */}
  //       </form>
  //     </DialogContent>
  //   </Dialog>
  // }
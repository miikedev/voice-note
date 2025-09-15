import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const Page = async() => {
  const session = await getServerSession(authOptions);
  console.log('dashboard session', session);
  if (session?.user?.email !== 'maungdevv@gmail.com') {
    redirect("/"); // ✅ kick out if not logged in
  }

  return (
    <div className='p-5'>Dashboard Page</div>
  )
}

export default Page
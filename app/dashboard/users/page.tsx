import UsersList from '@/components/users-list';
import React from 'react';

const Page = async() => {

    return (
        <div>
            <h1 className='text-semibold text-lg'>User Management</h1>
            <UsersList />
        </div>
    );
};


export default Page;

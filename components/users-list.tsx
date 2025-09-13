"use server"
import { createUser, getUsers } from '@/lib/users'
import { ObjectId } from 'mongodb';
import React from 'react'
import DataTable from './user-data-table';
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface User {
    _id: ObjectId;
    email: string;
    image?: string;
    name: string;
}
const initialState = {
    message: null
}
const UsersList: React.FC = async () => {
    const session = await getServerSession(authOptions)
    const users = await getUsers();



    return (
        <div className="container mx-auto py-10">
            <div className='flex justify-end'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Create</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form action={createUser} className='flex flex-col gap-3'>
                            <DialogHeader>
                                <DialogTitle>Create User</DialogTitle>
                                <DialogDescription>
                                    Admin user only create user accounts to access voice note app
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input
                                        id="link"
                                        type="email"
                                        name="email"
                                        placeholder="please enter an email address"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                    <Button type="submit" variant="secondary">
                                        Submit
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable data={users} />
        </div>

    );
};

export default UsersList;
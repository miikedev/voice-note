"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ObjectId } from "mongodb"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type User  = {
  _id: ObjectId
  email: string
  name: string
  image: string
  action?: string
}

export const columns: ColumnDef<User>[] = [

  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
]
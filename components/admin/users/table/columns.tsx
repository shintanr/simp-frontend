"use client";

import { ColumnDef } from "@tanstack/react-table";
import ActionButtons from "./ActionButtons";
import { UserType } from "@/types/user";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "full_name",
    header: "Nama"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "nim",
    header: "Nim"
  },
  {
    accessorKey: "role",
    header: "Peran",
  },
  {
    header: "Aksi",
    accessorKey: "id", // Gunakan ID atau kunci unik lain untuk masing-masing baris
    // cell: ({ row }) => <ActionButtons data={row.original} />,
    cell: ({ row }) => <ActionButtons data={row.original} />
  }
];

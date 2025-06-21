"use client";

import { ColumnDef } from "@tanstack/react-table";
import ActionButtons from "./ActionButtons";
import { Praktikum } from "@/types/praktikum";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Praktikum>[] = [
  {
    accessorKey: "lab.name",
    header: "Lab"
  },
  {
    accessorKey: "name",
    header: "Nama Praktikum"
  },
  {
    accessorKey: "code",
    header: "Kode Praktikum"
  },
  {
    header: "Aksi",
    accessorKey: "id", // Gunakan ID atau kunci unik lain untuk masing-masing baris
    // cell: ({ row }) => <ActionButtons data={row.original} />,
    cell: ({ row }) => <ActionButtons data={row.original} />
    
  }
];

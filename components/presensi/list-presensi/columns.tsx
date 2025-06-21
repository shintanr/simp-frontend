"use client";

import { ColumnDef } from "@tanstack/react-table";
import StatusActionButton from "./statusActionButton";
import { ListPresensiType } from "@/types/presensi";
import DialogComplaintAsisten from "./dialogComplaintAsisten";

export const getColumns = (
  selectedModul: string
): ColumnDef<ListPresensiType>[] => [
  {
    accessorKey: "nim",
    header: "Nim",
  },
  {
    accessorKey: "nama_user",
    header: "Nama",
  },
  {
    accessorKey: "nama_kelompok",
    header: "Kelompok",
    sortingFn: (a, b) => {
      const aValue = parseInt(a.getValue("nama_kelompok") as string);
      const bValue = parseInt(b.getValue("nama_kelompok") as string);
      return aValue - bValue;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="w-full">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <StatusActionButton
            data={row.original}
            selectedModul={selectedModul}
          />
          <DialogComplaintAsisten data={row.original} />
        </div>
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ListPresensiType } from "@/types/presensi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import DialogComplaintPraktikan from "./dialogComplaintPraktikan";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ListPresensiType>[] = [
  {
    accessorKey: "id_modul",
    header: "pertemuan",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "waktu_presensi",
    header: "Waktu Presensi",
    cell: ({ row }) => {
      if (row.original.waktu_presensi === null) return "Belum Presensi";
      return dayjs(row.original.waktu_presensi).format("DD-MM-YYYY HH:mm:ss");
    },
  },
  {
    accessorKey: "nama_modul",
    header: "Modul",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusClassName = "";
      if (status === "Hadir") {
        statusClassName = "bg-green-500";
      } else if (status === "Telat") {
        statusClassName = "bg-yellow-500";
      } else if (status === "Izin") {
        statusClassName = "bg-blue-500";
      } else if (status === "Alpha") {
        statusClassName = "bg-red-500";
      } else {
        statusClassName = "bg-gray-500";
      }

      return (
        <Badge className={cn(statusClassName, "p-2 w-full")}>
          {status || "Belum Hadir"}
        </Badge>
      );
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return <DialogComplaintPraktikan data={row.original} />;
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PenilaianType } from "@/types/penilaian";
import DialogComplaintPraktikan from "./dialogComplaintPraktikan";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<PenilaianType>[] = [
  {
    accessorKey: "id_modul",
    header: "Pertemuan",
    cell: ({ row }) => {
      return row.index + 1;
    },
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
      return <Badge className={cn(statusClassName, "p-2 w-full")}>{status || "Belum Hadir"}</Badge>;
    },
  },
  {
    accessorKey: "nilai_tp",
    header: "Nilai TP",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_praktikum",
    header: "Nilai Praktikum",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_fd",
    header: "Nilai FD",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_laporan_tugas",
    header: "Nilai Laporan Tugas",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_responsi",
    header: "Nilai Responsi",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_total",
    header: "Nilai Total",
    cell: (info) => {
      if(info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return <DialogComplaintPraktikan data={row.original} />;
    },
  }
];

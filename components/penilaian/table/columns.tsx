"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenilaianType } from "@/types/penilaian";
import DialogFormPenilaian from "./dialogFormPenilaian";
import DialogComplaintAsisten from "./dialogComplaintAsisten";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getColumns = (
  selectedModul: string
): ColumnDef<PenilaianType>[] => [
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
  },
  {
    accessorKey: "nilai_tp",
    header: "Nilai TP",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_praktikum",
    header: "Nilai Praktikum",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_fd",
    header: "Nilai FD",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_laporan_tugas",
    header: "Nilai Laporan Tugas",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_responsi",
    header: "Nilai Responsi",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    accessorKey: "nilai_total",
    header: "Nilai Total",
    cell: (info) => {
      if (info.getValue() === null) return "Belum dinilai";
      return info.getValue();
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <DialogFormPenilaian
            data={row.original}
            selectedModul={selectedModul}
          />
          <DialogComplaintAsisten data={row.original} />
        </div>
      );
    },
  },
];

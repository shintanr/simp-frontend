"use client";

import React, { useEffect, useState } from "react";
import StatisticCard from "@/components/presensi/StatisticCard";
import { DataTable } from "@/components/presensi/list-presensi/data-table";
import { getColumns } from "@/components/presensi/list-presensi/columns";
import {
  useGetPresensiPraktikumQuery,
  useGetSummaryPresensiPraktikumQuery,
} from "@/redux/services/presensiApi";
import { useParams } from "next/navigation";
import { useDetailPraktikumQuery } from "@/redux/services/praktikumApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDetailuserPraktikumQuery } from "@/redux/services/userPraktikum";
import { columns } from "@/components/presensi/list-presensi/columns-praktikan";
import ExportToExcel from "@/components/presensi/export/exportExcel";

const shiftOptions = [
  { label: "Shift 1 (07.00 - 09.00)", value: "1" },
  { label: "Shift 2 (10.00 - 12.00)", value: "2" },
  { label: "Shift 3 (13.00 - 15.00)", value: "3" },
  { label: "Shift 4 (16.00 - 18.00)", value: "4" },
];

function Page() {
  const params = useParams();
  const [selectedModul, setSelectedModul] = useState("1");
  const [selectedShift, setSelectedShift] = useState("1");
  const { data: praktikum, isLoading } = useDetailPraktikumQuery(params.id);
  const { data: userPraktikum, isLoading: isLoadingUser, error } =
    useDetailuserPraktikumQuery(params.id);

  const { data: presensi, isLoading: isLoadingPresensi } =
    useGetPresensiPraktikumQuery({
      id_user:
        userPraktikum?.data?.is_asisten == 1
          ? undefined
          : userPraktikum?.data?.id_user,
      id_praktikum: params.id,
      id_modul:
        userPraktikum?.data?.is_asisten == 1 ? selectedModul : undefined,
      id_shift:
        userPraktikum?.data?.is_asisten == 1 ? selectedShift : undefined,
    });

  const { data: summary, isLoading: isLoadingSummary } =
    useGetSummaryPresensiPraktikumQuery({
      id_user:
        userPraktikum?.data?.is_asisten == 1
          ? undefined
          : userPraktikum?.data?.id_user,
      id_praktikum: params.id,
      id_modul:
        userPraktikum?.data?.is_asisten == 1 ? selectedModul : undefined,
      id_shift:
        userPraktikum?.data?.is_asisten == 1 ? selectedShift : undefined,
    });


  useEffect(() => {
    if (praktikum) {
      setSelectedModul(praktikum.modules[0]?.id_modul.toString());
      setSelectedShift("1");
    }
  }, [praktikum]);

  if (isLoading || isLoadingPresensi || isLoadingSummary || isLoadingUser)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

          {/* Loading Text */}
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </main>
      </div>
    );

  if (!userPraktikum?.data || error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="flex flex-col items-center gap-4">
          {/* Error Text */}
          <h1 className="text-xl font-semibold text-gray-700">
            Anda tidak memiliki akses ke halaman ini
          </h1>
        </main>
      </div>
    );
  }


  return (
    <>
      <section className="px-8 py-4 text-white">
        <h1 className="text-3xl font-bold">
          {userPraktikum && userPraktikum.data.is_asisten == 1
            ? "PRESENSI"
            : "HISTORI PRESENSI"}
        </h1>
        <p className="text-lg text-yellow-300 font-semibold">
          {praktikum?.name}
        </p>
      </section>


      {/* Statistik */}
      <section className="px-8">
        <StatisticCard data={summary.data} />
      </section>

      {/* Table */}
      <section className="px-8 mt-8">
        <Card className="shadow-2xl border-0">
          <CardHeader className="border-b">
            {userPraktikum && userPraktikum.data.is_asisten == 1 ? (
              <CardTitle>
                <div className="flex w-full justify-between items-center">
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Kehadiran Praktikan</h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedShift}
                      onValueChange={setSelectedShift}
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Pilih shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shiftOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            onClick={() => setSelectedShift(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ExportToExcel
                      data={presensi.data}
                      filename={`Presensi Praktikum ${praktikum?.name}.xlsx`}
                    />
                  </div>
                </div>
              </CardTitle>
            ) : (
              <div></div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {userPraktikum && userPraktikum.data.is_asisten == 1 && (
              <div className="flex w-full justify-between items-center gap-4 pb-4 border-b px-6">
                <div className="flex items-center gap-4">
                  {praktikum &&
                    praktikum?.modules.map(
                      (
                        modul: {
                          id_modul: number;
                          id_praktikum: number;
                          judul_modul: string;
                          deskripsi: string;
                          file_modul: string;
                        },
                        index: number
                      ) => (
                        <button
                          key={modul.id_modul}
                          onClick={() =>
                            setSelectedModul(modul.id_modul.toString())
                          }
                          className={`p-2 rounded text-sm border shadow-lg font-bold hover:bg-yellow-400 transition ease-in-out duration-300 ${
                            selectedModul === modul.id_modul.toString()
                              ? "bg-yellow-200 text-black"
                              : "bg-gray-200"
                          }`}
                        >
                          Pertemuan {index + 1}
                        </button>
                      )
                    )}
                </div>
                <div>
                  <Input
                    className="border px-4 py-2 rounded"
                    placeholder="Search"
                    // optional search handling here
                  />
                </div>
              </div>
            )}
            <div className="w-full pt-4 px-6">
              <DataTable
                columns={
                  userPraktikum && userPraktikum.data.is_asisten == 1
                    ? getColumns(selectedModul)
                    : columns
                }
                data={presensi.data}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export default Page;

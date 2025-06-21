import React, { memo } from "react";
import dayjs from "@/lib/dayjs";
import { PresensiSummary } from "@/types/presensi";

interface StatisticCardProps {
  data: PresensiSummary
}
function StatisticCard({ data }: StatisticCardProps) {
  const tanggal = dayjs().format("dddd, D MMMM YYYY");

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
          📢
        </div>
        <div>
          <p className="text-sm font-semibold">{tanggal}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Total Praktikan</p>
          <p className="text-xl font-bold">{data.total_praktikan}</p>
        </div>
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Belum Hadir</p>
          <p className="text-xl font-bold text-red-500">{data.belum_hadir}</p>
        </div>
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Hadir</p>
          <p className="text-xl font-bold text-green-500">{data.hadir}</p>
        </div>
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Telat</p>
          <p className="text-xl font-bold text-yellow-500">{data.telat}</p>
        </div>
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Izin</p>
          <p className="text-xl font-bold text-blue-400">{data.izin}</p>
        </div>
        <div className="text-center border-2 border-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Alpha</p>
          <p className="text-xl font-bold text-red-400">{data.alpha}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(StatisticCard);

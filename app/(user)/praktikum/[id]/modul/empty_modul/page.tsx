'use client';

import { useRouter } from 'next/navigation';

export default function EmptyModulPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <div className="mb-6">
        {/* Icon buku/info */}
        <svg
          className="w-16 h-16 text-blue-500 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 4h.01M19.5 9.75v6a3.75 3.75 0 01-3.75 3.75H8.25A3.75 3.75 0 014.5 15.75v-6A3.75 3.75 0 018.25 6h7.5A3.75 3.75 0 0119.5 9.75z"
          />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Modul Belum Tersedia
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        Modul untuk praktikum ini belum tersedia. Silakan cek kembali nanti atau hubungi asisten praktikum.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
        >
          ← Kembali
        </button>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}

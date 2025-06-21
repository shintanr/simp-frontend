import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

interface Modul3Props {
  pdfUrl: string | null;
}

const Modul_3: React.FC<Modul3Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">
        Modul 3: Identify MAC and IP Addresses dan Configure Initial Router Settings
      </h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Menjelaskan perbedaan antara alamat MAC dan alamat IP.</li>
        <li>Menggunakan perintah CLI untuk memverifikasi alamat Layer 1, 2, dan 3.</li>
        <li>Menetapkan nama perangkat, password, dan banner awal pada router.</li>
        <li>Mengaktifkan interface dan menetapkan alamat IP pada interface.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Perlengkapan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Packet Tracer</li>
        <li>Laptop</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buat topologi jaringan sederhana dengan 2 PC dan 1 router.</li>
        <li>Koneksikan PC ke router menggunakan kabel straight.</li>
        <li>Gunakan CLI untuk melakukan konfigurasi dasar router: hostname, enable password, line console, dan banner.</li>
        <li>Aktifkan interface router dan beri IP address sesuai kebutuhan.</li>
        <li>Konfigurasikan IP address pada masing-masing PC dan gateway-nya.</li>
        <li>Gunakan perintah <code>ipconfig</code> dan <code>ping</code> pada PC untuk menguji koneksi.</li>
        <li>Gunakan perintah <code>show ip interface brief</code> dan <code>show mac-address-table</code> untuk melihat informasi alamat IP dan MAC.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Modul ini membantu mahasiswa memahami perbedaan dan hubungan antara alamat MAC dan IP, serta cara melakukan
        konfigurasi awal pada router melalui CLI.
      </p>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-md font-semibold flex items-center">
          <FaFilePdf className="text-red-600 mr-2" />
          Materi Tambahan:
        </h4>
        <p className="text-gray-700 mt-2">Unduh PDF modul ini untuk referensi lebih lanjut:</p>

        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Download Modul 3 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-md font-semibold flex items-center">
          <FaTools className="text-red-600 mr-2" />
          Bahan Praktikum Tambahan
        </h4>

        <p className="text-gray-700 mt-2">
          Anda bisa mengunduh Packet Tracer untuk simulasi jaringan melalui tautan berikut:
        </p>

        <a
          href="https://www.netacad.com/portal/resources/packet-tracer"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center px-4 py-2 bg-[#0267FE] text-white rounded-md hover:bg-[#0256d9] transition-colors"
        >
          <FaDownload className="mr-2" />
          Download Cisco Packet Tracer
        </a>
      </div>
    </div>
  );
};

export default Modul_3;

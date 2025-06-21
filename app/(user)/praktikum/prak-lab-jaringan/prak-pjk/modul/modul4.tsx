import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

interface Modul4Props {
  pdfUrl: string | null;
}

const Modul_4: React.FC<Modul4Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">
        Modul 4: Subnet an IPv4 Network dan Verify IPv4 and IPv6 Addressing
      </h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Membagi jaringan IPv4 menjadi beberapa subnet.</li>
        <li>Mengkonfigurasi alamat IPv4 dan IPv6 pada perangkat.</li>
        <li>Memverifikasi konfigurasi alamat IPv4 dan IPv6 dengan perintah CLI.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Perlengkapan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Packet Tracer</li>
        <li>Laptop/PC</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Membuat topologi jaringan dengan 2 PC dan 1 router.</li>
        <li>Melakukan subnetting terhadap alamat IPv4 yang diberikan.</li>
        <li>Menentukan alamat jaringan, broadcast, dan host untuk setiap subnet.</li>
        <li>Mengkonfigurasi alamat IPv4 dan IPv6 pada interface router dan PC.</li>
        <li>Melakukan verifikasi konektivitas menggunakan perintah <code>ping</code>.</li>
        <li>Memverifikasi alamat IP dengan perintah <code>ipconfig</code> dan <code>show</code>.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Modul ini membantu mahasiswa memahami cara melakukan subnetting jaringan IPv4 dan konfigurasi dasar alamat IPv4 serta IPv6, serta bagaimana memverifikasi konfigurasi tersebut menggunakan perintah CLI.
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
            Download Modul 4 (PDF)
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

export default Modul_4;
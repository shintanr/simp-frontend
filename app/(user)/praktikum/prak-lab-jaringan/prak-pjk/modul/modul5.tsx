import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

interface Modul5Props {
  pdfUrl: string | null;
}

const Modul_5: React.FC<Modul5Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">
        Modul 5: Secure Network Devices dan Design and Build a Small Network
      </h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami konsep keamanan pada perangkat jaringan.</li>
        <li>Mengimplementasikan pengamanan dasar pada perangkat jaringan.</li>
        <li>Merancang dan membangun jaringan skala kecil.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Perlengkapan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Packet Tracer</li>
        <li>Laptop/PC</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Merancang topologi jaringan kecil yang terdiri dari router, switch, dan beberapa PC.</li>
        <li>Mengkonfigurasi hostname dan banner pada perangkat jaringan.</li>
        <li>Mengatur password konsol, vty, dan enable secret untuk akses keamanan.</li>
        <li>Mengaktifkan login lokal dan mengenkripsi password dengan service password-encryption.</li>
        <li>Menerapkan perintah keamanan lainnya seperti timeout dan login blocking.</li>
        <li>Melakukan konektivitas dan pengujian keamanan konfigurasi.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa memahami pentingnya pengamanan perangkat jaringan dan mampu mengaplikasikan konfigurasi dasar
        keamanan serta membangun jaringan kecil yang sesuai dengan standar praktik jaringan komputer.
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
            Download Modul 5 (PDF)
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

export default Modul_5;

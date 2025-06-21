import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

interface Modul1Props {
  pdfUrl: string | null;
}

const Modul_1: React.FC<Modul1Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">
        Modul 1: Wire Crimping and Configure Initial Switch Settings
      </h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Mampu melakukan crimping kabel UTP sesuai dengan standar straight dan cross.</li>
        <li>Mampu mengkonfigurasi pengaturan awal switch.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Perlengkapan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>UTP Cable</li>
        <li>RJ-45</li>
        <li>Crimping Tool</li>
        <li>LAN Tester</li>
        <li>Switch Cisco</li>
        <li>Laptop</li>
        <li>Kabel console dan USB to Serial</li>
        <li>Software terminal (Putty, TeraTerm, dsb)</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Siapkan kabel UTP sesuai kebutuhan.</li>
        <li>Lakukan crimping kabel straight dan cross menggunakan crimping tool.</li>
        <li>Uji kabel dengan LAN Tester untuk memastikan koneksi benar.</li>
        <li>Hubungkan switch ke laptop menggunakan kabel console dan USB to serial.</li>
        <li>Buka software terminal (Putty atau lainnya) dan koneksikan ke switch.</li>
        <li>Lakukan konfigurasi awal pada switch seperti hostname, password, dan lain-lain.</li>
        <li>Simpan konfigurasi.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Dengan praktikum ini, mahasiswa memahami proses pembuatan kabel jaringan (straight dan cross)
        serta dapat melakukan konfigurasi awal perangkat jaringan seperti switch Cisco.
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
            Download Modul 1 (PDF)
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
          Anda bisa mengunduh driver USB to Serial atau software terminal (Putty) melalui link berikut:
        </p>

        <a
          href="https://drive.google.com/drive/folders/1gRxv9Fe3xVO1FrkA5kCkXyAVZeb4wnnT?usp=share_link"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center px-4 py-2 bg-[#0267FE] text-white rounded-md hover:bg-[#0256d9] transition-colors"
        >
          <FaDownload className="mr-2" />
          Download Putty
        </a>
      </div>
    </div>
  );
};

export default Modul_1;

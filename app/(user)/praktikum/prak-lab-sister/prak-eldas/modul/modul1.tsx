import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

// Define the props interface
interface Modul1Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_1: React.FC<Modul1Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 1 BAB II: Pengenalan EasyEDA, Hukum Ohm, dan Kirchhoff</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Melakukan simulasi rangkaian elektronik menggunakan EasyEDA.</li>
        <li>Merakit dan menganalisis rangkaian resistor serta mengimplementasikan Hukum Ohm dan Kirchhoff.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>EasyEDA:</strong> Software berbasis web untuk desain dan simulasi rangkaian elektronik tanpa perlu instalasi tambahan.</li>
        <li><strong>Hukum Ohm:</strong> I = V/R (Arus sebanding dengan tegangan dan berbanding terbalik dengan hambatan).</li>
        <li><strong>Hukum Kirchhoff:</strong></li>
        <ul className="list-disc pl-10">
          <li><strong>Junction Rule:</strong> Total arus yang masuk simpul = total arus keluar.</li>
          <li><strong>Loop Rule:</strong> Jumlah beda potensial dalam satu loop tertutup = nol.</li>
        </ul>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buat Project Baru di EasyEDA → Klik New Project dan masuk ke simulation mode.</li>
        <li>Beri nama proyek modul1_kelxx.</li>
        <li>Rancang rangkaian sesuai dengan gambar yang disediakan.</li>
        <li>Tambahkan Multimeter untuk pengukuran tegangan dan arus.</li>
        <li>Jalankan Simulasi dengan klik tombol Run.</li>
        <li>Modifikasi Hambatan dari 1KΩ ke 10KΩ, lalu amati perubahan arus.</li>
        <li>Tambahkan Amperemeter untuk mengukur arus dalam rangkaian.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Melalui praktikum ini, mahasiswa dapat memahami cara menggunakan EasyEDA untuk merancang dan
        menganalisis rangkaian listrik serta menerapkan Hukum Ohm dan Kirchhoff dalam simulasi.
      </p>

      {/* Link Download PDF */}
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
          Bahan Praktikum
        </h4>

        <p className="text-gray-700 mt-2">
          Unduh Bahan Praktikum ini:
        </p>

        <a
          href="https://easyeda.com/page/download"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center px-4 py-2 bg-[#0267FE] text-white rounded-md hover:bg-[#0256d9] transition-colors"
        >
          <FaDownload className="mr-2" />
          Bahan Praktikum
        </a>
      </div>
    </div>
  );
};

export default Modul_1;

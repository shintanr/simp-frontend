import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface for Modul 4
interface Modul4Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_4: React.FC<Modul4Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 4: Karakteristik Dioda dan Transistor</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Menganalisis karakteristik dioda dalam kondisi bias maju dan bias mundur.</li>
        <li>Mengamati perilaku transistor sebagai saklar dan penguat arus.</li>
        <li>Mempelajari konfigurasi rangkaian dasar yang menggunakan dioda dan transistor.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Dioda:</strong> Komponen semikonduktor yang memungkinkan arus mengalir dalam satu arah.</li>
        <li><strong>Bias Maju:</strong> Arus mengalir saat tegangan maju diberikan.</li>
        <li><strong>Bias Mundur:</strong> Arus hampir tidak mengalir kecuali dalam kondisi breakdown.</li>
        <li><strong>Transistor:</strong> Komponen dengan tiga terminal yang berfungsi sebagai saklar atau penguat.</li>
        <li><strong>Mode Saklar:</strong> Operasi dalam kondisi saturasi dan cutoff.</li>
        <li><strong>Mode Penguat:</strong> Transistor bekerja dengan perbandingan arus basis dan kolektor.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Mengukur karakteristik arus-tegangan (I-V) dioda dalam bias maju dan bias mundur.</li>
        <li>Menganalisis hubungan antara arus basis, kolektor, dan emitor pada transistor.</li>
        <li>Melakukan simulasi rangkaian dioda dan transistor menggunakan EasyEDA.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Praktikum ini memberikan pemahaman mendalam tentang karakteristik dioda dan transistor, serta penerapannya dalam rangkaian elektronik.
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
            Download Modul 4 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_4;

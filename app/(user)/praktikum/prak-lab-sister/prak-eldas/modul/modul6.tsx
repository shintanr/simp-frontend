import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface for Modul 6
interface Modul6Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_6: React.FC<Modul6Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 6: Dioda Transistor Logic dan Transistor-Transistor Logic</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami definisi logika dioda-transistor (DTL) dan logika transistor-transistor (TTL).</li>
        <li>Menganalisis perbedaan antara logika DTL dan TTL.</li>
        <li>Merancang rangkaian substitusi gerbang logika dengan dioda dan transistor.</li>
        <li>Merangkai transistor menjadi gerbang logika.</li>
        <li>Memahami cara kerja rangkaian logika DTL dan TTL.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Dioda Transistor Logic (DTL):</strong> Gerbang logika yang menggunakan jaringan dioda untuk fungsi logika dan transistor untuk penguatan sinyal.</li>
        <li><strong>Transistor Transistor Logic (TTL):</strong> Gerbang logika yang sepenuhnya menggunakan transistor untuk fungsi logika dan penguatan sinyal, umum digunakan dalam IC digital.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li><strong>Rangkaian Logika Dioda-Transistor (NAND Gate):</strong>
          <ul className="list-disc pl-5">
            <li>Gunakan EasyEDA untuk merancang sirkuit.</li>
            <li>Komponen: DC Power 5V, Switch SPST, Dioda 1N4148, Resistor 470Ω, Transistor 2N2222, LED.</li>
            <li>Amati perubahan output saat switch berganti posisi.</li>
          </ul>
        </li>
        <li><strong>Rangkaian Logika Transistor-Transistor (NOT Gate):</strong>
          <ul className="list-disc pl-5">
            <li>Gunakan EasyEDA untuk merancang sirkuit.</li>
            <li>Komponen: DC Power 5V, Switch SPST, Dioda 1N4148, Resistor, Transistor 2N2222, LED, GND.</li>
            <li>Amati perubahan output saat switch berganti posisi.</li>
          </ul>
        </li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Modul ini menjelaskan perbedaan antara logika DTL dan TTL serta penerapannya dalam gerbang logika dasar.
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
            Download Modul 6 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_6;

import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface for Modul 5
interface Modul5Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_5: React.FC<Modul5Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 5: Konfigurasi Transistor dan Diode Resistor Logic</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Menganalisis berbagai konfigurasi transistor (Common Base, Common Emitter, dan Common Collector).</li>
        <li>Merancang dan memahami konsep Diode Resistor Logic (DRL) sebagai gerbang logika dasar.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Common Base (CB):</strong> Impedansi input rendah, penguatan tegangan tinggi, cocok untuk frekuensi tinggi.</li>
        <li><strong>Common Collector (CC):</strong> Impedansi input tinggi, penguatan arus tinggi, sering digunakan sebagai buffer.</li>
        <li><strong>Common Emitter (CE):</strong> Penguatan tegangan dan arus tinggi, banyak digunakan dalam amplifier.</li>
        <li><strong>Diode Resistor Logic (DRL):</strong> Logika gerbang sederhana menggunakan dioda dan resistor.</li>
        <li><strong>Gerbang Logika DRL:</strong> Hanya dapat membentuk gerbang dasar seperti AND dan OR.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Merancang dan menjalankan simulasi rangkaian konfigurasi CB, CC, dan CE menggunakan EasyEDA.</li>
        <li>Menganalisis karakteristik arus dan tegangan pada setiap konfigurasi.</li>
        <li>Mendesain gerbang logika sederhana menggunakan dioda dan resistor.</li>
        <li>Mengamati bagaimana perubahan input mempengaruhi output rangkaian logika.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Modul ini menjelaskan perbedaan konfigurasi transistor dalam penguatan sinyal serta prinsip dasar logika digital menggunakan dioda dan resistor.
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
            Download Modul 5 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_5;

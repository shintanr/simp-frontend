import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface
interface Modul2Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_2: React.FC<Modul2Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 2 BAB III: Rangkaian Pembagi Arus, Tegangan, dan Transformasi Delta-Star</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami dan merakit rangkaian resistor dalam konfigurasi seri dan paralel.</li>
        <li>Menghitung dan mencari nilai hasil transformasi rangkaian bintang ke segitiga dan sebaliknya.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Rangkaian Pembagi Arus:</strong> Membagi arus ke beberapa cabang berdasarkan hambatan masing-masing.</li>
        <li><strong>Rangkaian Pembagi Tegangan:</strong> Mengubah tegangan input besar menjadi tegangan output yang lebih kecil.</li>
        <li><strong>Transformasi Delta-Star:</strong> Metode mengubah rangkaian resistor dari bentuk delta ke star atau sebaliknya untuk memudahkan perhitungan.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Merancang rangkaian pembagi arus dan tegangan menggunakan EasyEDA.</li>
        <li>Mengukur dan menghitung arus serta tegangan pada setiap titik rangkaian.</li>
        <li>Menerapkan transformasi Delta-Star untuk menghitung hambatan ekivalen.</li>
        <li>Membandingkan hasil simulasi dengan perhitungan teoretis.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Praktikum ini membantu mahasiswa memahami konsep dasar pembagian arus dan tegangan serta penerapan transformasi Delta-Star dalam analisis rangkaian listrik.
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
            Download Modul 2 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_2;
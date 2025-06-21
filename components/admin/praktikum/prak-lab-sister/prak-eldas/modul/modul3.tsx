import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface
interface Modul3Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_3: React.FC<Modul3Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 3: Daya, Kapasitor, Induktor</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Menghitung kebutuhan daya yang diberikan oleh sumber arus dan tegangan.</li>
        <li>Menganalisis fungsi kapasitor dan induktor serta merangkai dalam rangkaian sederhana.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Daya Listrik:</strong> Energi yang diserap atau dihasilkan dalam sirkuit listrik. Rumus: P = V × I, P = I²R, P = V²/R.</li>
        <li><strong>Kapasitor:</strong> Komponen yang menyimpan dan melepaskan muatan listrik. Rumus: Q = C × V.</li>
        <li><strong>Induktor:</strong> Komponen yang menyimpan energi dalam bentuk medan magnet sesuai Hukum Induksi Faraday.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Membuat rangkaian daya listrik menggunakan EasyEDA dan mengamati perubahan tegangan serta arus.</li>
        <li>Melakukan simulasi pengisian kapasitor dan mengukur perubahannya.</li>
        <li>Melakukan eksperimen dengan induktor untuk memahami sifat medan magnetnya.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Praktikum ini memperkenalkan konsep dasar daya listrik, serta karakteristik kapasitor dan induktor dalam rangkaian listrik.
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
            Download Modul 3 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_3;

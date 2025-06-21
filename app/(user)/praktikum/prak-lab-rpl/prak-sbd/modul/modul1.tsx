import React from "react";
import { FaFilePdf, FaDownload, FaTools } from "react-icons/fa";

interface Modul1Props {
  pdfUrl: string | null;
}

const Modul_1: React.FC<Modul1Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 1: Pengenalan MySQL</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Mahasiswa mampu memahami dasar-dasar basis data relasional dan penggunaan MySQL.</li>
        <li>Mahasiswa mampu melakukan instalasi dan konfigurasi MySQL di sistem mereka.</li>
        <li>Mahasiswa mampu melakukan operasi dasar seperti membuat database, tabel, dan mengelola data.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>MySQL:</strong> Merupakan sistem manajemen basis data relasional (RDBMS) open-source yang menggunakan bahasa SQL (Structured Query Language).</li>
        <li><strong>SQL:</strong> Bahasa yang digunakan untuk mengakses dan memanipulasi basis data.</li>
        <li><strong>Perintah Dasar:</strong> SELECT, INSERT, UPDATE, DELETE, CREATE DATABASE, CREATE TABLE, dsb.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Instal MySQL di komputer masing-masing atau gunakan XAMPP untuk akses lebih mudah.</li>
        <li>Buka terminal MySQL atau gunakan tools seperti phpMyAdmin.</li>
        <li>Buat sebuah database dengan perintah <code>CREATE DATABASE praktikum;</code></li>
        <li>Buat tabel baru dan isikan data sesuai instruksi.</li>
        <li>Lakukan query SELECT, INSERT, UPDATE, dan DELETE untuk memahami operasi dasar SQL.</li>
        <li>Eksplorasi perintah tambahan seperti ALTER TABLE dan DROP TABLE.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa telah memahami dasar penggunaan MySQL dan mampu mengelola database sederhana menggunakan perintah SQL dasar.
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
            Download Modul 1 MySQL (PDF)
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
          Anda dapat menggunakan <a href="https://www.apachefriends.org/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">XAMPP</a> atau install <a href="https://dev.mysql.com/downloads/mysql/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MySQL Community Server</a> secara manual.
        </p>
      </div>
    </div>
  );
};

export default Modul_1;

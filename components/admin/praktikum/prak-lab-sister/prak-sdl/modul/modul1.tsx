import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface
interface Modul1Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_1_SDL: React.FC<Modul1Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 1 BAB II: Coding Structural, Data Flow, dan Behavioral</h3>
      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami perbedaan dari tiga level abstraksi kode Verilog.</li>
        <li>Menulis dan menjalankan kode Verilog menggunakan Xilinx Vivado.</li>
        <li>Melakukan konfigurasi papan Nexys A7 untuk mengimplementasikan kode Verilog.</li>
      </ul>
      <h4 className="text-md font-semibold mt-2">Alat dan Bahan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>PC/Laptop</li>
        <li>Papan Nexys A7</li>
        <li>Software Xilinx Vivado</li>
      </ul>
      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Multiplexer:</strong> Menggabungkan beberapa sinyal menjadi satu untuk efisiensi komunikasi.</li>
        <li><strong>Demultiplexer:</strong> Memisahkan satu sinyal menjadi beberapa keluaran.</li>
        <li><strong>FPGA:</strong> Sirkuit terintegrasi yang dapat dikonfigurasi ulang sesuai kebutuhan pengguna.</li>
      </ul>
      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buka Xilinx Vivado dan buat proyek baru.</li>
        <li>Beri nama proyek <strong>m1p1_kelxx</strong> (XX sesuai nomor kelompok).</li>
        <li>Pilih tipe <strong>RTL Project</strong> dan papan Nexys A7-100T.</li>
        <li>Tambahkan file desain Verilog: <strong>MUX_GL, MUX_DF, dan MUX_BHV</strong>.</li>
        <li>Tambahkan kode Verilog untuk multiplexer dengan pendekatan Structural, Data Flow, dan Behavioral.</li>
        <li>Buat file constraint untuk papan Nexys A7.</li>
        <li>Generate Bitstream dan program perangkat.</li>
        <li>Amati perilaku papan menggunakan switch dan LED.</li>
      </ol>
      <h4 className="text-md font-semibold mt-2">Kode Verilog:</h4>
      <p className="text-gray-700 font-semibold">Kode Multiplexer:</p>
      <pre className="bg-gray-200 p-2 rounded"><code>{`
 module muxgl(output c, input a, b, s);
 wire nots, and1, and2;
 not (nots, s);
 and (and1, a, nots);
 and (and2, b, s);
 or (c, and1, and2);
 endmodule
 `}</code></pre>
      <p className="text-gray-700 font-semibold">Kode Demultiplexer:</p>
      <pre className="bg-gray-200 p-2 rounded"><code>{`
 module demuxgl(output a, b, input c, s);
 wire nots;
 not (nots, s);
 and (a, c, nots);
 and (b, c, s);
 endmodule
 `}</code></pre>
      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa dapat memahami implementasi multiplexer dan demultiplexer menggunakan tiga level abstraksi Verilog
        serta mengonfigurasi papan Nexys A7 dengan Xilinx Vivado.
      </p>
      
      {/* Link Download PDF - Updated to use database URL */}
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
    </div>
  );
};

export default Modul_1_SDL;
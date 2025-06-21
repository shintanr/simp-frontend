import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

interface Modul4Props {
  pdfUrl: string | null;
}

const Modul_4_SDL: React.FC<Modul4Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 4 BAB IV: Coding Latches</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami konsep D-Latch dan SR-Latch.</li>
        <li>Memahami konsep SR Flip-Flop dan JK Flip-Flop.</li>
        <li>Mengimplementasikan konsep Latch dan Flip-Flop ke FPGA Nexys A7.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Alat dan Bahan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Laptop</li>
        <li>Papan Nexys A7</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Latches:</strong> Rangkaian yang menyimpan satu bit informasi.</li>
        <li><strong>SR Latch:</strong> Latch dengan input Set dan Reset.</li>
        <li><strong>D Latch:</strong> Latch dengan satu input yang menentukan keluaran.</li>
        <li><strong>Flip-Flop:</strong> Rangkaian bistabil yang menyimpan informasi dengan sinyal clock.</li>
        <li><strong>FPGA:</strong> Sirkuit terintegrasi yang dapat dikonfigurasi ulang.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buka Xilinx Vivado dan buat proyek baru.</li>
        <li>Beri nama proyek <strong>Modul4_KelompokXX</strong> (XX sesuai nomor kelompok).</li>
        <li>Pilih tipe <strong>RTL Project</strong> dan papan Nexys A7-100T.</li>
        <li>Buat file Verilog untuk D-Latch dan SR-Latch.</li>
        <li>Buat file constraint untuk papan Nexys A7.</li>
        <li>Generate Bitstream dan program perangkat.</li>
        <li>Amati perubahan nilai latch berdasarkan input.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kode Verilog:</h4>
      <p className="text-gray-700 font-semibold">Kode D-Latch:</p>
      <pre className="bg-gray-200 p-2 rounded overflow-x-auto"><code>{`
module dlat (output x, not_x, input d);
  wire not_d;
  not (not_d, d);
  nor (not_x, d, x);
  nor (x, not_d, not_x);
endmodule
      `}</code></pre>

      <p className="text-gray-700 font-semibold mt-2">Kode SR-Latch:</p>
      <pre className="bg-gray-200 p-2 rounded overflow-x-auto"><code>{`
module srlat (output x, not_x, input s, r);
  nor (not_x, s, x);
  nor (x, r, not_x);
endmodule
      `}</code></pre>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa dapat memahami konsep D-Latch dan SR-Latch serta mengimplementasikan
        desainnya dalam FPGA Nexys A7 menggunakan Verilog.
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
            Download Modul 4 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_4_SDL;

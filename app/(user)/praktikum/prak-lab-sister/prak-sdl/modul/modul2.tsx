import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Define the props interface
interface Modul2Props {
  pdfUrl: string | null;
}

// Use the interface with your functional component
const Modul_2_SDL: React.FC<Modul2Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 2 BAB III: Coding Reuse</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami konsep kode Verilog.</li>
        <li>Membuat dan mengimplementasikan kode Verilog pada Vivado.</li>
        <li>Menerapkan konsep coding reuse pada Vivado.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Alat dan Bahan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Laptop</li>
        <li>Papan Nexys A7</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Coding Reuse:</strong> Teknik modularisasi untuk efisiensi pengembangan perangkat lunak.</li>
        <li><strong>Half Adder:</strong> Rangkaian yang menjumlahkan dua bilangan biner satu bit.</li>
        <li><strong>Full Adder:</strong> Rangkaian yang menjumlahkan dua bilangan biner satu bit dengan carry input.</li>
        <li><strong>Multiplexer:</strong> Menggabungkan beberapa sinyal ke satu jalur komunikasi.</li>
        <li><strong>FPGA:</strong> Sirkuit terintegrasi yang dapat dikonfigurasi ulang setelah manufaktur.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buka Xilinx Vivado dan buat proyek baru.</li>
        <li>Beri nama proyek <strong>m2p1_kelxx</strong> (XX sesuai nomor kelompok).</li>
        <li>Pilih tipe <strong>RTL Project</strong> dan papan Nexys A7-100T.</li>
        <li>Buat file Verilog: <strong>Full Adder</strong> menggunakan <strong>Half Adder</strong>.</li>
        <li>Buat file constraint untuk papan Nexys A7.</li>
        <li>Generate Bitstream dan program perangkat.</li>
        <li>Amati perilaku papan menggunakan switch dan LED.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kode Verilog:</h4>
      <p className="text-gray-700 font-semibold">Kode Full Adder menggunakan Half Adder:</p>
      <pre className="bg-gray-200 p-2 rounded"><code>{`
module full_adder(s, co, a, b, ci);
  input a, b, ci;
  output s, co;
  wire t, k;

  half v1(t, c, a, b);
  half v2(s, k, t, ci);
  or (co, k, c);
endmodule

module half(s, c, a, b);
  input a, b;
  output s, c;
  assign s = a ^ b;
  assign c = a & b;
endmodule
`}</code></pre>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa dapat memahami implementasi Full Adder menggunakan Half Adder serta
        konsep coding reuse dalam desain digital menggunakan Verilog pada Vivado.
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
            Download Modul 2 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_2_SDL;

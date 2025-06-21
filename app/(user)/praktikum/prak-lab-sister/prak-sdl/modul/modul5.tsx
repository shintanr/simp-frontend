import React from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

interface Modul5Props {
  pdfUrl: string | null;
}

const Modul_5_SDL: React.FC<Modul5Props> = ({ pdfUrl }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Modul 5 BAB VI: Desain FSM dan Implementasi</h3>

      <h4 className="text-md font-semibold mt-2">Tujuan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Memahami jenis-jenis metodologi desain HDL.</li>
        <li>Membedakan konsep finite state machine Mealy dan Moore.</li>
        <li>Mengimplementasikan desain FSM Mealy dan Moore.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Alat dan Bahan:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Laptop</li>
        <li>Papan Nexys A7</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Dasar Teori:</h4>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Gaya Pemodelan HDL:</strong> Dataflow, Behavioral, dan Structural.</li>
        <li><strong>Metodologi Top-Down & Bottom-Up:</strong> Pendekatan desain dari modul besar ke kecil atau sebaliknya.</li>
        <li><strong>FSM Moore:</strong> Output hanya dipengaruhi oleh current state.</li>
        <li><strong>FSM Mealy:</strong> Output dipengaruhi oleh current state dan input.</li>
        <li><strong>FPGA:</strong> Sirkuit terintegrasi yang dapat dikonfigurasi ulang.</li>
      </ul>

      <h4 className="text-md font-semibold mt-2">Langkah Kerja:</h4>
      <ol className="list-decimal pl-5 text-gray-700">
        <li>Buka Xilinx Vivado dan buat proyek baru.</li>
        <li>Beri nama proyek <strong>Modul5_KelompokXX</strong> (XX sesuai nomor kelompok).</li>
        <li>Pilih tipe <strong>RTL Project</strong> dan papan Nexys A7-100T.</li>
        <li>Buat file Verilog untuk FSM Moore.</li>
        <li>Buat file Verilog untuk FSM Mealy.</li>
        <li>Buat file constraint untuk papan Nexys A7.</li>
        <li>Generate Bitstream dan program perangkat.</li>
        <li>Amati perubahan output berdasarkan state dan input.</li>
      </ol>

      <h4 className="text-md font-semibold mt-2">Kode Verilog:</h4>
      <p className="text-gray-700 font-semibold">Kode FSM Moore:</p>
      <pre className="bg-gray-200 p-2 rounded overflow-x-auto"><code>{`
module fsm_moore(
  input a, b, c, d, clock, reset,
  output reg y
);
  parameter [1:0] state0 = 2'b00, state1 = 2'b01, state2 = 2'b10, state3 = 2'b11;
  reg [1:0] current_state, next_state;

  always @(posedge clock or posedge reset) begin
    if (reset == 1)
      current_state = state0;
    else
      current_state = next_state;
  end

  always @(current_state or a or b or c or d) begin
    case (current_state)
      state0: next_state = a ? state1 : state0;
      state1: next_state = b ? state1 : state2;
      state2: next_state = c ? state3 : state0;
      state3: next_state = d ? state1 : state2;
    endcase
  end

  always @(current_state) begin
    case (current_state)
      state0: y = 0;
      state1: y = 0;
      state2: y = 0;
      state3: y = 1;
    endcase
  end
endmodule
      `}</code></pre>

      <h4 className="text-md font-semibold mt-2">Kesimpulan:</h4>
      <p className="text-gray-700">
        Mahasiswa dapat memahami dan membandingkan implementasi FSM Moore dan Mealy
        serta mengimplementasikannya menggunakan Verilog pada FPGA Nexys A7.
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
            Download Modul 5 (PDF)
          </a>
        ) : (
          <p className="text-gray-500 italic mt-2">PDF tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Modul_5_SDL;

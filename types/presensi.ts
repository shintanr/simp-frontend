export type PresensiSummary = {
  total_pertemuan: number;
  total_praktikan: number;
  belum_hadir: number;
  hadir: number;
  telat: number;
  izin: number;
  alpha: number;
};

export type ListPresensiType = {
  id: number;
  id_user: number;
  id_praktikum: number;
  id_modul: number;
  id_shift: number;
  is_asisten: number;
  status: string;
  waktu_presensi: Date;
  nama_user: string;
  nim: string;
  nama_praktikum: string;
  nama_modul: string;
  nama_shift: string;
  nama_kelompok: string;
  id_complaint: string | null;
  komplain: string | null;
  status_komplain: string | null;
};

"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, PenLine, Loader2, User } from "lucide-react";
import { useRouter } from 'next/navigation';

// Type definitions
interface Praktikum {
  id?: string;
  id_praktikum?: string;
  name: string;
}

interface Pertemuan {
  id_pertemuan: string;
  pertemuan_ke: number;
}

interface Submission {
  id_praktikum: string;
  id_pertemuan: string;
  nim: string;
  nama_praktikan: string;
  total_score: number | null;
  id_attempts: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PertemuanMapping {
  [key: string]: number;
}

export default function TugasPendahuluanAsisten() {
  const [praktikumList, setPraktikumList] = useState<Praktikum[]>([]);
  const [pertemuanList, setPertemuanList] = useState<Pertemuan[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPraktikum, setSelectedPraktikum] = useState<string | null>(null);
  const [selectedPertemuan, setSelectedPertemuan] = useState<string | null>(null);
  const [pertemuanMapping, setPertemuanMapping] = useState<PertemuanMapping>({});
  const router = useRouter();

  useEffect(() => { 
    fetchPraktikum();
  }, []);

  useEffect(() => {
    if (selectedPraktikum) {
      fetchPertemuan(selectedPraktikum);
    } else {
      setPertemuanList([]);
      setSelectedPertemuan(null);
      setPertemuanMapping({});
    }
  }, [selectedPraktikum]);

  useEffect(() => {
    if (selectedPraktikum) {
      fetchSubmissions();
    }
  }, [selectedPraktikum, selectedPertemuan]);

  const fetchPraktikum = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:8080/api/praktikum");
      const data: ApiResponse<Praktikum[]> = await res.json();
      if (res.ok) setPraktikumList(data.data);
    } catch (error) {
      console.error('Error fetching praktikum:', error);
    }
  };

  const fetchPertemuan = async (praktikumId: string): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:8080/api/pertemuan/${praktikumId}`);
      const data: ApiResponse<Pertemuan[]> = await res.json();
      if (res.ok) {
        setPertemuanList(data.data);
        const mapping: PertemuanMapping = {};
        data.data.forEach(p => mapping[p.id_pertemuan] = p.pertemuan_ke);
        setPertemuanMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching pertemuan:', error);
    }
  };
  
  const getPertemuanKe = (id: string): number | string => pertemuanMapping[id] || id;

  const fetchSubmissions = async (): Promise<void> => {
    setLoading(true);
    try {
      let url = "http://localhost:8080/api/asprak/tugas-pendahuluan/details";
      if (selectedPraktikum && selectedPertemuan && selectedPertemuan !== "all") {
        url += `?idPraktikum=${selectedPraktikum}&idPertemuan=${selectedPertemuan}`;
      } else if (selectedPraktikum) {
        url += `?idPraktikum=${selectedPraktikum}`;
      }

      const res = await fetch(url);
      const data: ApiResponse<Submission[]> = await res.json();
      if (res.ok && data.success) setSubmissions(data.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (id_attempts: string) => {
    const params = new URLSearchParams();
    if (selectedPraktikum) params.append("praktikum", selectedPraktikum);
    if (selectedPertemuan) params.append("pertemuan", selectedPertemuan);

    let url = `/tugas-pendahuluan/tugas-pendahuluan_asprak/detail/${id_attempts}`;
    if (params.toString()) url += `?${params.toString()}`;
    router.push(url);
  };

  // Function to format total score display
  const formatTotalScore = (score: number | null) => {
    if (score === null || score === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    return (
      <span className={`font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
        {score}
      </span>
    );
  };

  const handlePraktikumChange = (value: string) => {
    setSelectedPraktikum(value);
  };

  const handlePertemuanChange = (value: string) => {
    setSelectedPertemuan(value);
  };

  const getPraktikumId = (praktikum: Praktikum, index: number): string => {
    return praktikum.id || praktikum.id_praktikum || index.toString();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-br  from-purple-600 via-purple-700 to-indigo-800 h-60 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-30 bg-white rounded-full -ml-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24"></div>
        </div>
        <div className="flex items-center space-x-4 relative z-10 -mt-16">
          <h1 className="text-3xl font-bold text-white tracking-wider">TUGAS PENDAHULUAN PRAKTIKAN</h1>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto p-6 -mt-32 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label className="text-gray-700 mb-2 block font-medium">Praktikum</Label>
              <Select value={selectedPraktikum || ""} onValueChange={handlePraktikumChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Praktikum" />
                </SelectTrigger>
                <SelectContent>
                  {praktikumList.map((praktikum, index) => (
                    <SelectItem 
                      key={`praktikum-${index}`} 
                      value={getPraktikumId(praktikum, index)}
                    >
                      {praktikum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 mb-2 block font-medium">Pertemuan</Label>
              <Select 
                value={selectedPertemuan || ""} 
                onValueChange={handlePertemuanChange} 
                disabled={!selectedPraktikum}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Pertemuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pertemuan</SelectItem>
                  {pertemuanList.map(p => (
                    <SelectItem key={p.id_pertemuan} value={p.id_pertemuan}>
                      Pertemuan {p.pertemuan_ke}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Memuat data tugas pendahuluan...</span>
            </div>
          ) : submissions.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pertemuan</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Skor</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission, index) => (
                    <tr key={`${submission.id_praktikum}-${submission.id_pertemuan}-${submission.nim}-${index}`}>
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{submission.nama_praktikan}</div>
                            <div className="text-xs text-gray-500">{submission.nim}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Pertemuan {getPertemuanKe(submission.id_pertemuan)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {formatTotalScore(submission.total_score)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => handleViewDetail(submission.id_attempts)}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                          size="sm"
                        >
                          <PenLine size={16} className="mr-2" /> Nilai
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 min-h-[300px] flex flex-col items-center justify-center text-gray-400 border border-gray-100">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500 mb-2">Belum ada tugas pendahuluan</p>
              <p className="text-sm text-gray-400">
                {!selectedPraktikum
                  ? "Silakan pilih praktikum untuk melihat daftar submission"
                  : "Tidak ada submission untuk filter yang dipilih"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
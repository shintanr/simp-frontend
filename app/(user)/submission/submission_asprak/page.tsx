"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Eye, Loader2, User } from "lucide-react";
import { useRouter } from 'next/navigation';

// Types
interface Praktikum {
  id?: string | number;
  id_praktikum?: string | number;
  name?: string;
}

interface Pertemuan {
  id_pertemuan: string | number;
  pertemuan_ke: number;
}

interface Submission {
  id_submission_praktikan: string | number;
  nama_praktikan?: string;
  nim?: string;
  id_pertemuan: string | number;
  jenis: string;
  status: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Constants
const API_BASE_URL = "http://localhost:8080/api";

export default function SubmissionAsprak() {
  // State
  const [praktikumList, setPraktikumList] = useState<Praktikum[]>([]);
  const [pertemuanList, setPertemuanList] = useState<Pertemuan[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: "", 
    type: "error" 
  });
  const [selectedPraktikum, setSelectedPraktikum] = useState<string>("");
  const [selectedPertemuan, setSelectedPertemuan] = useState<string>("");
  const [pertemuanMapping, setPertemuanMapping] = useState<Record<string, number>>({});

  const router = useRouter();

  // Utility functions
  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "error" }), 3000);
  }, []);

  const formatJenisLaporan = (jenis: string): string => {
    const formatMap: Record<string, string> = {
      fd: "Form Data (FD)",
      laporan: "Laporan Praktikum"
    };
    return formatMap[jenis] || jenis;
  };

  const getPertemuanKe = (idPertemuan: string | number): number => {
    return pertemuanMapping[idPertemuan.toString()] || Number(idPertemuan);
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { bg: string; text: string }> = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800' },
      revisi: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      acc: { bg: 'bg-green-100', text: 'text-green-800' }
    };

    const config = statusConfig[status.toLowerCase()] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800' 
    };
    
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text} w-20 justify-center`}>
        {status}
      </span>
    );
  };

  // API functions
  const fetchPraktikum = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/praktikum`);
      const data = await response.json();
      
      if (response.ok) {
        setPraktikumList(data.data || []);
      } else {
        console.error("Failed to fetch praktikum:", data.message);
        showNotification("Gagal mengambil data praktikum", "error");
      }
    } catch (error) {
      console.error("Error fetching praktikum:", error);
      showNotification("Terjadi kesalahan saat mengambil data praktikum", "error");
    }
  }, [showNotification]);

  const fetchPertemuan = useCallback(async (praktikumId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pertemuan/${praktikumId}`);
      const data = await response.json();
      
      if (response.ok) {
        const pertemuanData = data.data || [];
        setPertemuanList(pertemuanData);
        
        // Create mapping of id_pertemuan to pertemuan_ke
        const mapping: Record<string, number> = {};
        pertemuanData.forEach((pertemuan: Pertemuan) => {
          mapping[pertemuan.id_pertemuan.toString()] = pertemuan.pertemuan_ke;
        });
        setPertemuanMapping(mapping);
      } else {
        console.error("Failed to fetch pertemuan:", data.message);
        showNotification("Gagal mengambil data pertemuan", "error");
      }
    } catch (error) {
      console.error("Error fetching pertemuan:", error);
      showNotification("Terjadi kesalahan saat mengambil data pertemuan", "error");
    }
  }, [showNotification]);

  const fetchSubmissions = useCallback(async () => {
    if (!selectedPraktikum) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ idPraktikum: selectedPraktikum });
      if (selectedPertemuan && selectedPertemuan !== "all") {
        params.append("idPertemuan", selectedPertemuan);
      }

      const url = `${API_BASE_URL}/asprak/submissions?${params.toString()}`;
      console.log("Fetching submissions from:", url);

      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubmissions(data.data || []);
      } else {
        console.error("Failed to fetch submissions:", data.message);
        showNotification("Gagal mengambil data submission", "error");
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      showNotification("Terjadi kesalahan saat mengambil data submission", "error");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPraktikum, selectedPertemuan, showNotification]);

  // Event handlers
  const handlePraktikumChange = useCallback((value: string) => {
    setSelectedPraktikum(value);
    setSelectedPertemuan("");
    setPertemuanList([]);
    setPertemuanMapping({});
    setSubmissions([]);
    console.log("Selected praktikum:", value);
  }, []);

  const handlePertemuanChange = useCallback((value: string) => {
    setSelectedPertemuan(value);
    console.log("Selected pertemuan:", value);
  }, []);

  const handleViewDetail = useCallback((submissionId: string | number) => {
    const queryParams = new URLSearchParams();
    if (selectedPraktikum) queryParams.append("praktikum", selectedPraktikum);
    if (selectedPertemuan) queryParams.append("pertemuan", selectedPertemuan);
    
    let detailUrl = `/submission/submission_asprak/detail/${submissionId}`;
    const queryString = queryParams.toString();
    if (queryString) detailUrl += `?${queryString}`;
    
    console.log("Navigating to:", detailUrl);
    router.push(detailUrl);
  }, [selectedPraktikum, selectedPertemuan, router]);

  // Effects
  useEffect(() => {
    fetchPraktikum();
  }, [fetchPraktikum]);

  useEffect(() => {
    if (selectedPraktikum) {
      fetchPertemuan(selectedPraktikum);
    }
  }, [selectedPraktikum, fetchPertemuan]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Render helpers
  const renderEmptyState = () => (
    <div className="bg-white rounded-xl shadow-sm min-h-[300px] flex flex-col items-center justify-center text-gray-400 border border-gray-100">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-lg text-gray-500 mb-2">Belum ada submission</p>
      <p className="text-sm text-gray-400">
        {!selectedPraktikum
          ? "Silakan pilih praktikum untuk melihat daftar submission"
          : "Tidak ada submission untuk filter yang dipilih"}
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <span className="ml-2 text-gray-600">Memuat data submission...</span>
    </div>
  );

  const renderSubmissionTable = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Mahasiswa
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pertemuan
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission, index) => (
            <tr 
              key={`${submission.id_submission_praktikan}-${index}`} 
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.nama_praktikan || 'Mahasiswa'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {submission.nim || 'NIM'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Pertemuan {getPertemuanKe(submission.id_pertemuan)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {formatJenisLaporan(submission.jenis)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                {getStatusBadge(submission.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <Button
                  onClick={() => handleViewDetail(submission.id_submission_praktikan)}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  size="sm"
                >
                  <Eye size={16} className="mr-2" /> Lihat
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full bg-gradient-to-br  from-purple-600 via-purple-700 to-indigo-800 h-60 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-30 bg-white rounded-full -ml-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24"></div>
        </div>
        <div className="flex items-center space-x-4 relative z-10 -mt-16">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            ASISTENSI SUBMISSION
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto p-6 -mt-32 relative z-10">
        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label className="text-gray-700 mb-2 block font-medium">Praktikum</Label>
              <Select onValueChange={handlePraktikumChange} value={selectedPraktikum}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Praktikum" />
                </SelectTrigger>
                <SelectContent>
                  {praktikumList.map((praktikum, index) => (
                    <SelectItem 
                      key={`praktikum-${index}`} 
                      value={(praktikum.id || praktikum.id_praktikum || index).toString()}
                    >
                      {praktikum.name || 'Nama tidak tersedia'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-700 mb-2 block font-medium">Pertemuan</Label>
              <Select 
                onValueChange={handlePertemuanChange}
                value={selectedPertemuan}
                disabled={!selectedPraktikum}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Pertemuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pertemuan</SelectItem>
                  {pertemuanList.map((pertemuan) => (
                    <SelectItem 
                      key={`pertemuan-${pertemuan.id_pertemuan}`} 
                      value={pertemuan.id_pertemuan.toString()}
                    >
                      Pertemuan {pertemuan.pertemuan_ke}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submission Content */}
          {loading ? renderLoadingState() : 
           submissions.length > 0 ? renderSubmissionTable() : 
           renderEmptyState()}
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300">
          <div className={`${
            notification.type === "success" 
              ? "bg-green-100 border-green-500 text-green-700" 
              : "bg-red-100 border-red-500 text-red-700"
          } border-l-4 p-4 rounded-r shadow-md flex items-center w-80`}>
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
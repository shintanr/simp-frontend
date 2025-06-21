"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/ui/button";
import { Textarea } from "@/components/ui/ui/textarea";
import { Card, CardContent } from "@/components/ui/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ui/select";
import { AlertCircle, ArrowLeft, CheckCircle, Download, FileText, Loader2, SendHorizontal, Upload } from "lucide-react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

// Define types for better type safety
interface Submission {
  id: string;
  id_user: string;
  praktikum_name?: string;
  id_pertemuan?: string;
  jenis: string;
  nama_praktikan?: string;
  nim?: string;
  file_path?: string;
  status?: string;
  catatan_asistensi?: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

export default function SubmissionAsprakDetail() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" });
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const selectedPraktikum = searchParams.get('praktikum');
  const selectedPertemuan = searchParams.get('pertemuan');

  useEffect(() => {
    console.log("URL params:", { 
      selectedPraktikum, 
      selectedPertemuan 
    });
    
    fetchSubmissionDetail();
  }, [id]);

  const fetchSubmissionDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/asprak/submissions/${id}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubmission(data.data);
        setStatus(data.data.status || "Submitted");
        setCatatan(data.data.catatan_asistensi || "");
      } else {
        console.error("Failed to fetch submission detail:", data.message);
        showNotification("Gagal mengambil detail submission", "error");
      }
    } catch (error) {
      console.error("Error fetching submission detail:", error);
      showNotification("Terjadi kesalahan saat mengambil detail submission", "error");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
          'application/pdf': ['.pdf'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      maxSize: 10 * 1024 * 1024,
      onDrop: (acceptedFiles) => {
          setFile(acceptedFiles[0]);
      },
      disabled: status === "acc",
      onDragEnter: undefined,
      onDragLeave: undefined,
      onDragOver: undefined,
      multiple: undefined
  });

  const handleSubmit = async () => {
    if (!status) {
      showNotification("Silakan pilih status asistensi", "error");
      return;
    }

    if (status === "revisi" && !catatan.trim()) {
      showNotification("Silakan berikan catatan untuk revisi", "error");
      return;
    }

    // Check if submission exists and has required properties
    if (!submission || !submission.id_user) {
      showNotification("Data submission tidak valid", "error");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      // Ensure id is a string before appending
      const submissionId = Array.isArray(id) ? id[0] : id;
      if (submissionId) {
        formData.append("id_submission_praktikan", submissionId);
      }
      formData.append("id_user", submission.id_user);
      formData.append("status", status);
      formData.append("catatan_asistensi", catatan);
      
      if (file) {
        formData.append("file_revisi", file);
      }

      const response = await fetch("http://localhost:8080/api/asprak/submission/asistensi", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification("Asistensi berhasil disimpan!", "success");
        setTimeout(() => {
          // Redirect ke halaman submission_asprak dengan parameter praktikum dan pertemuan
          const queryParams = new URLSearchParams();
          if (selectedPraktikum) queryParams.append("praktikum", selectedPraktikum);
          if (selectedPertemuan) queryParams.append("pertemuan", selectedPertemuan);
          
          const queryString = queryParams.toString();
          router.push(`/submission/submission_asprak${queryString ? `?${queryString}` : ''}`);
        }, 2000);
      } else {
        console.error("Failed to save asistensi:", data.message);
        showNotification("Gagal menyimpan asistensi. Silakan coba lagi.", "error");
      }
    } catch (error) {
      console.error("Error submitting asistensi:", error);
      showNotification("Terjadi kesalahan saat menyimpan asistensi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    const queryParams = new URLSearchParams();
    if (selectedPraktikum) queryParams.append("praktikum", selectedPraktikum);
    if (selectedPertemuan) queryParams.append("pertemuan", selectedPertemuan);
    
    const queryString = queryParams.toString();
    router.push(`/submission/submission_asprak${queryString ? `?${queryString}` : ''}`);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const formatJenisLaporan = (jenis: string) => {
    if (jenis === "fd") return "Form Data (FD)";
    if (jenis === "laporan") return "Laporan Praktikum";
    return jenis;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="ml-2 text-gray-600">Memuat data submission...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative w-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-12 md:py-16 flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold text-2xl md:text-3xl lg:text-4xl tracking-tight">
                Detail Submission
              </h1>
              <p className="text-purple-100 mt-2 text-sm md:text-base">
                {submission?.praktikum_name || "Praktikum"} - Pertemuan {submission?.id_pertemuan || "-"}
              </p>
            </div>
            <Button 
              onClick={handleBack}
              className="bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center"
              variant="ghost"
            >
              <ArrowLeft size={16} className="mr-2" />
              Kembali
            </Button>
          </div>
        </div>
        
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full transform rotate-45"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full transform -rotate-45"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submission ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - File Preview */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">File Submission</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {formatJenisLaporan(submission.jenis)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Disubmit oleh: {submission.nama_praktikan || "Mahasiswa"} ({submission.nim || "NIM"})
                    </p>
                  </div>
                </div>

                <div className="aspect-video rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {submission.file_path ? (
                    <iframe
                      src={submission.file_path}
                      className="w-full h-full"
                      title="Document Preview"
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">Preview tidak tersedia</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  {submission.file_path ? (
                    <a
                      href={submission.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </a>
                  ) : (
                    <Button disabled className="text-gray-500 bg-gray-100 cursor-not-allowed">
                      <Download className="mr-2 h-4 w-4" />
                      File Tidak Tersedia
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Asistensi Form */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Asistensi {formatJenisLaporan(submission.jenis)}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Asistensi
                    </label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="revisi">Revisi</SelectItem>
                        <SelectItem value="acc">ACC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Catatan Asistensi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Asistensi {status === "revisi" && <span className="text-red-500">*</span>}
                    </label>
                    <Textarea
                      placeholder="Berikan catatan atau feedback untuk mahasiswa..."
                      className="w-full min-h-[120px] border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                    />
                  </div>

                  {/* File Upload - Only show if status is "revisi" */}
                  {status === "revisi" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Revisi (Opsional)
                      </label>
                      <div 
                        {...getRootProps()} 
                        className={`border-2 ${isDragActive ? "border-purple-400 bg-purple-50" : "border-dashed border-gray-300"} 
                          rounded-lg p-4 text-center cursor-pointer transition-all hover:border-purple-500 hover:bg-purple-50`}
                      >
                        <input {...getInputProps()} />
                        {file ? (
                          <div className="flex flex-col items-center py-2">
                            <FileText className="h-8 w-8 text-purple-600 mb-2" />
                            <p className="text-green-600 font-medium mb-1 text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-2">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-700 font-medium mb-1 text-sm">Klik atau drop file di sini</p>
                            <p className="text-gray-500 text-xs">PDF atau Docx (Maks. 10MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md shadow-sm hover:shadow transition-all flex justify-center items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="mr-2 h-4 w-4" />
                        <span>Simpan Asistensi</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <CardContent>
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Submission Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-6">
                Data submission yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
              <Button onClick={handleBack} className="bg-purple-600 hover:bg-purple-700 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Submission
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300">
          <div className={`${
            notification.type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"
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
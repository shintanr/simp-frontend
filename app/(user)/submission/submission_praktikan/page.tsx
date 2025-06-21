"use client";
import React from 'react';
import { Button } from "@/components/ui/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/ui/dialog";
import { Label } from "@/components/ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ui/select";
import { AlertCircle, Calendar, CheckSquare, Eye, FilePlus, Home, Star, Trash2, Upload, UploadCloud, User, FileDown, MessageSquare, DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from 'next/navigation';
import Header from "@/components/ui/ui/header"
import { useSession } from 'next-auth/react';
import Navbar from '@/components/shared/navbar';
import Link from 'next/link';

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

interface SubmissionItem {
  id_submission_praktikan: string;
  id_pertemuan: string;
  jenis: string;
  status: string;
  file_revisi_asprak?: string;
  catatan_asistensi?: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function AddSubmissionButton() {
  const [open, setOpen] = useState(false);
  const [jenisPraktikum, setJenisPraktikum] = useState("");
  const [pertemuan, setPertemuan] = useState("");
  const [jenisFile, setJenisFile] = useState("");
  const [praktikumList, setPraktikumList] = useState<Praktikum[]>([]);
  const [pertemuanList, setPertemuanList] = useState<Pertemuan[]>([]);
  const [pertemuanMapping, setPertemuanMapping] = useState<Record<string, number>>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: "", type: "success" });
  const [submissionData, setSubmissionData] = useState<SubmissionItem[]>([]);
  const [selectedPraktikum, setSelectedPraktikum] = useState("");
  const [selectedPraktikumName, setSelectedPraktikumName] = useState("");
  const [showCatatanModal, setShowCatatanModal] = useState(false);
  const [currentCatatan, setCurrentCatatan] = useState("");
  const router = useRouter();
  
  // handle session
  const session = useSession();

  useEffect(() => {
    async function fetchPraktikum() {
      try {
        const response = await fetch("http://localhost:8080/api/praktikum");
        const data = await response.json();
        if (response.ok) {
          setPraktikumList(data.data || []);
        } else {
          console.error("Failed to fetch praktikum:", data.message);
        }
      } catch (error) {
        console.error("Error fetching praktikum:", error);
      }
    }
    fetchPraktikum();
  }, []);

  // Fixed fetchPertemuan with proper typing
  useEffect(() => {
    const fetchPertemuan = async (praktikumId: string) => {
      if (!praktikumId) {
        setPertemuanList([]);
        setPertemuanMapping({});
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8080/api/pertemuan/${praktikumId}`);
        const data = await response.json();
        
        if (response.ok && data.data) {
          setPertemuanList(data.data);
          
          // Create a mapping of id_pertemuan to pertemuan_ke
          const mapping: Record<string, number> = {};
          data.data.forEach((pertemuan: Pertemuan) => {
            mapping[pertemuan.id_pertemuan] = pertemuan.pertemuan_ke;
          });
          setPertemuanMapping(mapping);
          
          console.log('Pertemuan data:', data.data); // Debug log
          console.log('Pertemuan mapping:', mapping); // Debug log
        } else {
          console.error("Failed to fetch pertemuan:", data.message);
          showNotification("Gagal mengambil data pertemuan", "error");
          setPertemuanList([]);
          setPertemuanMapping({});
        }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
        showNotification("Terjadi kesalahan saat mengambil data pertemuan", "error");
        setPertemuanList([]);
        setPertemuanMapping({});
      }
    };

    fetchPertemuan(jenisPraktikum);
  }, [jenisPraktikum]);

  // Fixed fetchPertemuanForMapping with proper typing
  useEffect(() => {
    const fetchPertemuanForMapping = async (praktikumId: string) => {
      if (!praktikumId) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/pertemuan/${praktikumId}`);
        const data = await response.json();
        
        if (response.ok && data.data) {
          // Update mapping untuk praktikum yang dipilih
          const mapping: Record<string, number> = {};
          data.data.forEach((pertemuan: Pertemuan) => {
            mapping[pertemuan.id_pertemuan] = pertemuan.pertemuan_ke;
          });
          setPertemuanMapping(prevMapping => ({
            ...prevMapping,
            ...mapping
          }));
        }
      } catch (error) {
        console.error("Error fetching pertemuan for mapping:", error);
      }
    };

    fetchPertemuanForMapping(selectedPraktikum);
  }, [selectedPraktikum]);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!selectedPraktikum) return;
      try {
        const response = await fetch(`http://localhost:8080/api/submission?idPraktikum=${selectedPraktikum}`);
        const data = await response.json();
        if (response.ok) {
          setSubmissionData(data.data || []);
        } else {
          console.error("Failed to fetch submission data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    }
    fetchSubmissions();
  }, [selectedPraktikum]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0] || null);
    },
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async () => {
    if (!jenisPraktikum || !pertemuan || !jenisFile) {
      showNotification("Silakan isi semua kolom yang diperlukan", "error");
      return;
    }
    
    if (!file) {
      showNotification("Silakan pilih file untuk diupload", "error");
      return;
    }

    const userId = session?.data?.user?.id;
    if (!userId) {
      showNotification("User ID tidak ditemukan", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("idPraktikum", jenisPraktikum);
    formData.append("idPertemuan", pertemuan);
    formData.append("jenis", jenisFile);
    formData.append("idUser", userId);

    try {
      const response = await fetch("http://localhost:8080/api/submission/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showNotification("Submission berhasil diunggah!", "success");
        setOpen(false);
        setFile(null);
        setJenisPraktikum("");
        setPertemuan("");
        setJenisFile("");
        
        if (selectedPraktikum === jenisPraktikum) {
          const submissionResponse = await fetch(`http://localhost:8080/api/submission?idPraktikum=${selectedPraktikum}`);
          const submissionData = await submissionResponse.json();
          if (submissionResponse.ok) {
            setSubmissionData(submissionData.data || []);
          }
        }
      } else {
        showNotification("Gagal submit. Silakan coba lagi.", "error");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      showNotification("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handlePraktikumChange = (value: string) => {
    setSelectedPraktikum(value);
    const praktikum = praktikumList.find(p => (p.id || p.id_praktikum) === value);
    if (praktikum) {
      setSelectedPraktikumName(praktikum.name);
    }
  };

  const handleViewFile = (item: SubmissionItem) => {
    console.log('handleViewFile called with:', item); // Debug log
    
    // Check if item exists
    if (!item) {
      console.error('Item is null or undefined');
      alert('Data submission tidak ditemukan');
      return;
    }
    
    // Check for id_submission_praktikan
    if (!item.id_submission_praktikan) {
      console.error('ID submission tidak ditemukan', item);
      console.log('Available keys in item:', Object.keys(item)); // Show available properties
      alert('ID submission tidak valid');
      return;
    }
    
    console.log('Navigating to:', `/submission_praktikan/preview/${item.id_submission_praktikan}`);
    
    // Try navigation with error handling
    try {
      router.push(`/submission_praktikan/preview/${item.id_submission_praktikan}`);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Gagal membuka halaman preview');
    }
  };


  const handleViewCatatan = (catatan: string) => {
    setCurrentCatatan(catatan || "Tidak ada catatan asistensi");
    setShowCatatanModal(true);
  };

  const handleDownloadRevisi = (filePath: string | undefined, submissionId: string) => {
    if (!filePath) {
      showNotification("File revisi tidak tersedia", "error");
      return;
    }
    
    // Menggunakan endpoint API dengan parameter submissionId
    window.open(`http://localhost:8080/api/submission/download/${submissionId}`, '_blank');
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus submission ini?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/submission/${submissionId}`, {
          method: "DELETE",
        });
  
        let responseData;
        try {
          responseData = await response.json();
        } catch (jsonError) {
          console.log("Response bukan format JSON:", await response.text());
        }
  
        if (response.ok) {
          showNotification("Submission berhasil dihapus!", "success");
          
          const submissionResponse = await fetch(`http://localhost:8080/api/submission?idPraktikum=${selectedPraktikum}`);
          const submissionData = await submissionResponse.json();
          if (submissionResponse.ok) {
            setSubmissionData(submissionData.data || []);
          }
        } else {
          const errorMessage = responseData?.message || "Gagal menghapus submission. Silakan coba lagi.";
          console.error("Server error:", errorMessage);
          showNotification(errorMessage, "error");
        }
      } catch (error) {
        console.error("Error deleting submission:", error);
        showNotification("Terjadi kesalahan pada jaringan. Silakan coba lagi.", "error");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    let bgColor: string, textColor: string;
    switch (status.toLowerCase()) {
      case 'submitted':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'revisi':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'acc':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor} w-20 justify-center`}>
        {status}
      </span>
    );
  };

  const formatJenisLaporan = (jenis: string) => {
    if (jenis === "fd") return "Form Data (FD)";
    if (jenis === "laporan") return "Laporan Praktikum";
    return jenis;
  };

  return (
    <>
    <div className="flex flex-col items-center min-h-screen ">
      {/* Submission Banner - MODIFIED: height doubled, content area positioned for better UI */}
      <div className="w-full bg-gradient-to-r from-[#0267FE] to-blue-700 h-60 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-30 bg-white rounded-full -ml-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24"></div>
        </div>
        <div className="flex items-center space-x-4 relative z-10 -mt-16">
          
          <h1 className="text-3xl font-bold text-white tracking-wider">SUBMISSION</h1>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto p-6 -mt-32 relative z-10">
        {/* Card Container for Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Title and Add Button + Praktikum Selection */}
          <div className="flex justify-between items-center mb-8">
            {/* Praktikum Selection */}
            <div>
              <Label className="text-gray-700 mb-2 block">Pilih Praktikum</Label>
              <Select onValueChange={handlePraktikumChange} value={selectedPraktikum}>
                <SelectTrigger className="w-64 border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Praktikum" />
                </SelectTrigger>
                <SelectContent>
                  {praktikumList.map((praktikum, index) => (
                    <SelectItem 
                    key={`praktikum-${index}`} 
                    value={praktikum.id || praktikum.id_praktikum || index.toString()} 
                    >
                      {praktikum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button //BUTTON TAMBAH SUBMISSION //
            className="bg-[#FFE156] hover:bg-[#FFD700] text-gray-800 px-5 py-2 rounded-lg shadow-md transition-all hover:shadow-lg"
            onClick={() => setOpen(true)}
            >
              <Upload className="mr-2 h-5 w-5" /> Tambah Submission
            </Button>
          </div>

          {/* Praktikum Title Display */}
          {selectedPraktikumName && (
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{selectedPraktikumName}</h3>
          )}

          {/* Submission Table */}
          {selectedPraktikum ? (
            submissionData.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertemuan ke</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Laporan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">File Revisi</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan Asistensi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissionData.map((item, index) => (
                      <tr key={item.id_submission_praktikan} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Pertemuan {pertemuanMapping[item.id_pertemuan] || item.id_pertemuan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatJenisLaporan(item.jenis)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                                {/* <button
                            onClick={() => handleViewFile(item)} // (1)
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button> */}
                            <button 
                              onClick={() => handleDeleteSubmission(item.id_submission_praktikan)}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {item.file_revisi_asprak ? (
                            <button 
                              onClick={() => handleDownloadRevisi(item.file_revisi_asprak, item.id_submission_praktikan)}
                              className="p-1 text-gray-600 rounded hover:text-blue-800 transition"
                              title="Download Revisi"
                            >
                              <DownloadIcon size={16} />
                            </button>
                          ) : (
                            <span className="text-gray-400">Tidak ada file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {item.catatan_asistensi ? (
                        <Button
                          onClick={() => {
                            if (item.catatan_asistensi) {
                              handleViewCatatan(item.catatan_asistensi);
                            }
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <Eye size={16} className="mr-1" /> Lihat
                        </Button>
                      ) : (
                        <span className="text-gray-400">Tidak ada catatan</span>
                      )}
                      
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 min-h-[300px] flex items-center justify-center text-gray-400 border border-gray-100">
                <p className="text-lg">Belum ada submission yang diunggah untuk praktikum ini</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 min-h-[300px] flex items-center justify-center text-gray-400 border border-gray-100">
              <p className="text-lg">Silakan pilih praktikum untuk melihat daftar submission</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog for Adding Submission */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Tambah Submission Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            <div>
              <Label className="text-gray-700 mb-1 block">Jenis Praktikum</Label>
              <Select onValueChange={setJenisPraktikum} value={jenisPraktikum}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Praktikum" />
                </SelectTrigger>

                  <SelectContent>
                    {praktikumList.map((praktikum, index) => (
                      <SelectItem 
                        key={`praktikum-${index}`} 
                        value={praktikum.id || praktikum.id_praktikum || index.toString()}
                      >
                        {praktikum.name || 'Nama tidak tersedia'}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 mb-1 block">Pertemuan</Label>
              <Select onValueChange={setPertemuan} value={pertemuan} disabled={!jenisPraktikum}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={!jenisPraktikum ? "Pilih praktikum terlebih dahulu" : "Pilih Pertemuan"} />
                </SelectTrigger>
                <SelectContent>
                  {pertemuanList.map((pertemuan) => (
                    <SelectItem key={pertemuan.id_pertemuan} value={pertemuan.id_pertemuan}>
                      Pertemuan {pertemuan.pertemuan_ke}
                    </SelectItem>
                  
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 mb-1 block">Jenis File</Label>
              <Select onValueChange={setJenisFile} value={jenisFile}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Jenis File" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fd">Form Data (FD)</SelectItem>
                  <SelectItem value="laporan">Laporan Praktikum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 mb-1 block">Upload File</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 ${isDragActive ? "border-blue-400 bg-blue-50" : "border-dashed border-gray-300"} 
                  rounded-lg p-8 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-3 mb-2">
                      <FilePlus className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-green-600 font-medium mb-1">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 mb-2">
                      <UploadCloud className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">Drag & drop file di sini</p>
                    <p className="text-gray-500 text-sm">Atau klik untuk memilih file</p>
                    <p className="text-gray-400 text-xs mt-2">PDF atau Docx (Maks. 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Batal
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={uploading || !file} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Mengunggah...
                </>
              ) : (
                "Kirim Submission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal untuk menampilkan catatan asistensi */}
      <Dialog open={showCatatanModal} onOpenChange={setShowCatatanModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Catatan Asistensi</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 whitespace-pre-line">{currentCatatan}</p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowCatatanModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white transition-all duration-300 z-50`}>
          {notification.type === "success" ? (
            <CheckSquare className="mr-2 h-5 w-5" />
          ) : (
            <AlertCircle className="mr-2 h-5 w-5" />
          )}
          <p>{notification.message}</p>
        </div>
      )}
    </div>
    </>
  );
}
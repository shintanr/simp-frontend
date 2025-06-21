"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Book, Calendar, CheckSquare, Eye, Home, Star, Upload, User, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";

// Type definitions
interface Praktikum {
  id: string;
  id_praktikum: string;
  name: string;
}

interface PertemuanTP {
  id_pertemuan: string;
  id_praktikum: string;
  pertemuan_ke: number;
  jumlah_soal: number;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export default function TugasPendahuluanPage() {
  const [praktikumList, setPraktikumList] = useState<Praktikum[]>([]);
  const [selectedPraktikum, setSelectedPraktikum] = useState<string>("");
  const [selectedPraktikumName, setSelectedPraktikumName] = useState<string>("");
  const [pertemuanList, setPertemuanList] = useState<PertemuanTP[]>([]);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const [activeTab, setActiveTab] = useState<string>("Tugas Pendahuluan");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchPraktikum(): Promise<void> {
      try {
        const response = await fetch("http://localhost:8080/api/praktikum");
        const data: ApiResponse<Praktikum[]> = await response.json();
        if (response.ok && data.data) {
          setPraktikumList(data.data);
        } else {
          console.error("Failed to fetch praktikum:", data.message);
          showNotification("Gagal mengambil data praktikum", "error");
        }
      } catch (error) {
        console.error("Error fetching praktikum:", error);
        showNotification("Terjadi kesalahan saat mengambil data praktikum", "error");
      }
    }
    fetchPraktikum();
  }, []);

  useEffect(() => {
    async function fetchPertemuanTP(): Promise<void> {
      if (!selectedPraktikum) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/tp/${selectedPraktikum}`);
        const data: PertemuanTP[] = await response.json();
        
        if (response.ok) {
          setPertemuanList(data);
        } else {
          console.error("Failed to fetch pertemuan TP:", data);
          showNotification("Gagal mengambil data tugas pendahuluan", "error");
        }
      } catch (error) {
        console.error("Error fetching pertemuan TP:", error);
        showNotification("Terjadi kesalahan saat mengambil data tugas pendahuluan", "error");
      } finally {
        setLoading(false);
      }
    }
    
    fetchPertemuanTP();
  }, [selectedPraktikum]);

  const showNotification = (message: string, type: "success" | "error"): void => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const handlePraktikumChange = (value: string): void => {
    setSelectedPraktikum(value);
    // Find the corresponding praktikum name
    const praktikum = praktikumList.find((p: Praktikum) => p.id === value);
    if (praktikum) {
      setSelectedPraktikumName(praktikum.name);
    }
  };

  const handlePertemuanClick = (praktikumId: string, pertemuanId: string): void => {
    router.push(`/tugas-pendahuluan/tugas-pendahuluan_praktikan/${praktikumId}/${pertemuanId}`);
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-[#0267FE] to-blue-700 h-60 flex items-center justify-center relative overflow-hidden shadow-md">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-30 bg-white rounded-full -ml-16 -mt-16"></div> {/* dot banner kiri */}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24"></div> {/* dot banner kanan */}
          </div>
          <div className="flex items-center space-x-4 relative z-10 -mt-16">
            <h1 className="text-3xl font-bold text-white tracking-wider">TUGAS PENDAHULUAN</h1>
          </div>
        </div>

        {/* Custom Notification */}
        {notification.show && (
          <div className="fixed top-6 right-6 z-50 transition-all duration-300 opacity-100">
            <div className={`${
              notification.type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"
            } border-l-4 p-4 rounded-r shadow-md flex items-center w-80 transform hover:scale-105 transition-transform`}>
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Content Area - Adjusted to match submission_praktikan layout */}
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
                    {praktikumList.map((praktikum: Praktikum, index: number) => (
                      <SelectItem 
                        key={`praktikum-${index}`} 
                        value={praktikum.id_praktikum || index.toString()} 
                        className="hover:bg-gray-100 focus:bg-gray-100 transition-colors"
                      >
                        {praktikum.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Praktikum Title Display - Moved below dropdown like in submission_praktikan */}
            {selectedPraktikumName && (
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{selectedPraktikumName}</h3>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-b-[#0267FE]"></div>
              </div>
            )}

            {/* Pertemuan List */}
            {!loading && selectedPraktikum && pertemuanList.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertemuan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Soal</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pertemuanList.map((item: PertemuanTP, index: number) => (
                      <tr 
                        key={item.id_pertemuan} 
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pertemuan {item.pertemuan_ke}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlah_soal} Soal</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => handlePertemuanClick(item.id_praktikum, item.id_pertemuan)}
                            className="flex items-center space-x-1 bg-[#0267FE] hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-all transform hover:scale-105 active:scale-95"
                          >
                            <Eye size={16} />
                            <span>Lihat Soal</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !loading && selectedPraktikum ? (
              <div className="bg-white rounded-xl shadow-sm p-8 min-h-[300px] flex items-center justify-center text-gray-400 border border-gray-100">
                <div className="text-center">
                  <NotebookPen className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <p className="text-lg">Belum ada tugas pendahuluan untuk praktikum ini</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 min-h-[300px] flex items-center justify-center text-gray-400 border border-gray-100">
                <div className="text-center">
                  <NotebookPen className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <p className="text-lg">Silakan pilih praktikum untuk melihat daftar tugas pendahuluan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
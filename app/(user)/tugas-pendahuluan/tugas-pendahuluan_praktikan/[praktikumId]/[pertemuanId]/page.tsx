"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Type definitions
interface Soal {
  id_soal: string;
  pertanyaan: string;
  pertemuan_ke: number;
}

interface PraktikumInfo {
  id: string;
  name: string;
}

interface JawabanMap {
  [soalId: string]: string;
}

interface FormattedJawaban {
  soalId: string;
  jawaban: string;
  skor: number | null;
}

interface SubmitPayload {
  praktikumId: number;
  pertemuanId: number;
  userId: string | undefined;
  totalScore: number | null;
  jawaban: FormattedJawaban[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
}

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
}

interface UseSessionReturn {
  data: {
    user: SessionUser;
  } | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export default function TugasPendahuluanDetailPage() {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [praktikumInfo, setPraktikumInfo] = useState<PraktikumInfo | null>(null);
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: "", 
    type: "" 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [jawaban, setJawaban] = useState<JawabanMap>({});
  const router = useRouter();
  const params = useParams();
  const praktikumId = params.praktikumId as string;
  const pertemuanId = params.pertemuanId as string;
  const session = useSession() as UseSessionReturn;

  useEffect(() => {
    async function fetchPraktikumInfo(): Promise<void> {
      try {
        const response = await fetch(`http://localhost:8080/api/praktikum/`);
        const data: ApiResponse<PraktikumInfo> = await response.json();
        if (response.ok && data.data) {
          setPraktikumInfo(data.data);
        } else {
          console.error("Failed to fetch praktikum info:", data.message);
        }
      } catch (error) {
        console.error("Error fetching praktikum info:", error);
      }
    }

    async function fetchSoalTP(): Promise<void> {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/tp/${praktikumId}/${pertemuanId}`);
        const data: Soal[] = await response.json();
        
        if (response.ok) {
          setSoalList(data);
          
          // Initialize jawaban object with empty strings for each soal
          const initialJawaban: JawabanMap = {};
          data.forEach(soal => {
            initialJawaban[soal.id_soal] = "";
          });
          setJawaban(initialJawaban);
        } else {
          console.error("Failed to fetch soal TP:", (data as any).message);
          showNotification("Gagal mengambil data soal tugas pendahuluan", "error");
        }
      } catch (error) {
        console.error("Error fetching soal TP:", error);
        showNotification("Terjadi kesalahan saat mengambil data soal", "error");
      } finally {
        setLoading(false);
      }
    }
    
    fetchPraktikumInfo();
    fetchSoalTP();
  }, [praktikumId, pertemuanId]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleBack = () => {
    router.push("/tugas-pendahuluan");
  };

  const handleJawabanChange = (soalId: string, value: string) => {
    setJawaban(prev => ({
      ...prev,
      [soalId]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    // Validate if all questions have been answered
    const unansweredQuestions = Object.entries(jawaban).filter(([_, value]) => !value.trim());
    if (unansweredQuestions.length > 0) {
      showNotification(`Mohon jawab semua pertanyaan (${unansweredQuestions.length} belum terjawab)`, "error");
      return;
    }

    setSubmitting(true);
    
    try {
      // Format data sesuai dengan API
      const formattedJawaban: FormattedJawaban[] = Object.entries(jawaban).map(([soalId, jawabanText]) => ({
        soalId,
        jawaban: jawabanText,
        skor: null // Akan diisi oleh admin nanti
      }));

      const payload: SubmitPayload = {
        praktikumId: parseInt(praktikumId),
        pertemuanId: parseInt(pertemuanId),
        userId: session?.data?.user?.id,
        totalScore: null, // Will be calculated by admin
        jawaban: formattedJawaban
      };

      console.log("Mengirim data:", payload);

      // Submit to API
      const response = await fetch("http://localhost:8080/api/submit-tp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result: ApiResponse<any> = await response.json();
        
        if (response.ok) {
          showNotification("Jawaban berhasil disimpan!", "success");
          
          // Optional: Reset form or redirect
          setTimeout(() => {
            router.push("/tugas-pendahuluan");
          }, 2000);
        } else {
          console.error("Error response from server:", result);
          showNotification(result.message || "Gagal menyimpan jawaban", "error");
        }
      } else {
        // Jika bukan JSON, coba dapatkan teks error
        const textResponse = await response.text();
        console.error("Server tidak mengembalikan JSON:", textResponse);
        showNotification("Terjadi kesalahan pada server. Endpoint mungkin tidak tersedia.", "error");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      showNotification("Terjadi kesalahan saat mengirim jawaban. Pastikan server berjalan dan endpoint tersedia.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Get pertemuan_ke from the first soal (should all be the same)
  const pertemuanKe: number | string = soalList.length > 0 ? soalList[0].pertemuan_ke : "";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Modern Sleek Banner */}
      <div className="relative w-full bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-12 md:py-16 flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold text-2xl md:text-3xl lg:text-4xl tracking-tight">
                {praktikumInfo ? praktikumInfo.name : "Loading..."}
              </h1>
              <p className="text-blue-100 mt-2 text-sm md:text-base">
                Pertemuan {pertemuanKe} - Tugas Pendahuluan
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

      {/* Custom Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 transition-all duration-300 opacity-100">
          <div className={`${
            notification.type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"
          } border-l-4 p-4 rounded-r shadow-md flex items-center w-80`}>
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        )}

        {/* Soal List with Textarea */}
        {!loading && soalList.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="px-6 md:px-8 py-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Daftar Soal</h3>
            </div>
            
            <ul>
              {soalList.map((soal, index) => (
                <li 
                  key={soal.id_soal} 
                  className={`px-6 md:px-8 py-6 ${index < soalList.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-gray-800 font-medium mb-3">Soal {index + 1}</h4>
                      <p className="text-gray-600 mb-4 whitespace-pre-line">{soal.pertanyaan}</p>
                      
                      <div>
                        <label 
                          htmlFor={`jawaban-${soal.id_soal}`} 
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Jawaban Anda:
                        </label>
                        <Textarea 
                          id={`jawaban-${soal.id_soal}`}
                          placeholder="Ketik jawaban Anda di sini..."
                          className="w-full min-h-[120px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 transition-all"
                          value={jawaban[soal.id_soal] || ""}
                          onChange={(e) => handleJawabanChange(soal.id_soal, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Submit Button */}
            <div className="px-6 md:px-8 py-6 bg-gray-50 rounded-b-xl flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal size={18} />
                    <span>Kirim Jawaban</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : !loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 min-h-[300px] flex items-center justify-center text-gray-400">
            <p className="text-lg">Belum ada soal tugas pendahuluan untuk pertemuan ini</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
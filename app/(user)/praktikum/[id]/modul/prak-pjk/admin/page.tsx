"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  FaChevronLeft, 
  FaUserCircle, 
  FaChevronDown, 
  FaChevronUp, 
  FaChevronRight,
  FaBookOpen,
  FaClipboardList,
  FaPlayCircle,
  FaExclamationTriangle,
  FaBars,
  FaGraduationCap,
  FaPlus,
  FaEdit,
  FaTrash,
  FaVideo,
  FaFilePdf,
  FaUpload,
  FaQuestion,
  FaCheck,
  FaTimes,
  FaEye,
  FaQuestionCircle
} from "react-icons/fa";

// Define interfaces for type safety
interface Module {
  id_modul: number;
  judul_modul: string;
  video_url?: string;
  pdf_url?: string;
  id_praktikum: number;
}

interface Submodule {
  id_submodul: number;
  judul_submodul: string;
  video_url?: string;
  pdf_url?: string;
  id_modul: number;
}

interface QuizQuestion {
  quiz_id: any;
  quiz: any;
  id: any;
  id_quiz: any;  // or use `string` or `number` based on your data type
  id_question: number;
  question_text: string;
  options: QuizOption[];
  id_submodul: number;
}

interface QuizOption {
  id_option: number;
  option_text: string;
  is_correct: boolean;
  id_question: number;
}

interface SubmodulesMap {
  [moduleId: number]: Submodule[];
}

interface QuestionsMap {
  [submoduleId: number]: QuizQuestion[];
}

interface ApiResponse<T> {
  data: T;
  status?: string;
  message?: string;
}

function AdminDashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<Submodule | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const [submodules, setSubmodules] = useState<SubmodulesMap>({});
  const [quizQuestions, setQuizQuestions] = useState<QuestionsMap>({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");

  // File upload refs
  const pdfFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  // Form states for editing/adding
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddingModule, setIsAddingModule] = useState<boolean>(false);
  const [isAddingSubmodule, setIsAddingSubmodule] = useState<boolean>(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadType, setUploadType] = useState<string>("");
  // Add this to your state variables
const [videoSourceType, setVideoSourceType] = useState<"file" | "youtube">("file");
  
  const [formData, setFormData] = useState<any>({
    judul_modul: "",
    judul_submodul: "",
    video_url: "",
    youtube_url: "",
    pdf_url: "",
    id_praktikum: 7, // Default praktikum ID for SDL
    question_text: "",
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false }
    ]
  });

  const router = useRouter();

  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return "";
    
    try {
      // Handle youtube.com/watch?v= format
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle youtu.be/ format
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // If it's already an embed URL, return as is
      if (url.includes("youtube.com/embed/")) {
        return url;
      }
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
    }
    
    // If we couldn't parse it, return the original URL
    return url;
  };

  // Fetch modules data
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/admin/get/modul/7");
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const data = await response.json() as ApiResponse<Module[]>;
      if (!data.data) {
        throw new Error("Invalid data structure received from server");
      }
      setModules(data.data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError(`Failed to load modules: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Fetch submodules for a specific module
  const fetchSubmodules = useCallback(async (moduleId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/praktikum/submodul/prak-pjk/${moduleId}`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json() as ApiResponse<Submodule[]>;
      setSubmodules(prev => ({ ...prev, [moduleId]: data.data || [] }));
    } catch (err) {
      console.error(`Error fetching submodules for module ${moduleId}:`, err);
      setSubmodules(prev => ({ ...prev, [moduleId]: [] }));
    }
  }, []);
  const fetchQuizQuestions = useCallback(async (submoduleId: number) => {
    // Tambahkan console log untuk memastikan fungsi dipanggil
    console.log(`Attempting to fetch quiz for submodule ${submoduleId}`);
    
    // Cek apakah submodul adalah quiz
    const isQuizSubmodule = isQuiz(submoduleId);
    console.log(`Is submodule ${submoduleId} a quiz? ${isQuizSubmodule}`);
    
    if (!isQuizSubmodule) {
      console.log("Not a quiz submodule, returning");
      return;
    }
  
  try {
    const url = `http://localhost:8080/api/submodul/quiz-pjk/${submoduleId}`;
    console.log(`Fetching from URL: ${url}`);
    
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server error: ${response.status}`, errorText);
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Received quiz data:", data);
    
    // Transform data to expected format
    let transformedData = [];
    
    if (data && data.data && Array.isArray(data.data)) {
      transformedData = data.data.map((item: { id_quiz: any; pertanyaan: any; pilihan_a: any; jawaban_benar: string; pilihan_b: any; pilihan_c: any; pilihan_d: any; }) => {
        return {
          id_question: item.id_quiz,
          question_text: item.pertanyaan,
          options: [
            { option_text: item.pilihan_a, is_correct: item.jawaban_benar === "A" },
            { option_text: item.pilihan_b, is_correct: item.jawaban_benar === "B" },
            { option_text: item.pilihan_c, is_correct: item.jawaban_benar === "C" },
            { option_text: item.pilihan_d, is_correct: item.jawaban_benar === "D" }
          ]
        };
      });
    }
    
    setQuizQuestions(prev => ({ ...prev, [submoduleId]: transformedData }));
  } catch (err) {
    console.error(`Detailed error fetching quiz questions for submodule ${submoduleId}:`, err);
    setQuizQuestions(prev => ({ ...prev, [submoduleId]: [] }));
  }
  }, []);

  const toggleDropdown = useCallback((moduleId: number) => {
    setOpenDropdowns(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );

    if (!submodules[moduleId]) {
      fetchSubmodules(moduleId);
    }
  }, [submodules, fetchSubmodules]);

  const isYouTubeLink = (url: string): boolean => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };


  const handleModuleClick = useCallback((module: Module) => {
    setSelectedModule(module);
    setSelectedSubmodule(null);
    setSelectedQuestion(null);
    setIsEditing(false);
    setIsAddingSubmodule(false);
    setIsAddingQuestion(false);
    setIsEditingQuestion(false);
    setActiveTab("details");
    
    // Determine video source type
    let videoType: "file" | "youtube" = "file";
    if (module.video_url && isYouTubeLink(module.video_url)) {
      videoType = "youtube";
    }
    
    setVideoSourceType(videoType);
    
    setFormData({
      judul_modul: module.judul_modul,
      video_url: videoType === "file" ? module.video_url || "" : "",
      youtube_url: videoType === "youtube" ? module.video_url || "" : "",
      pdf_url: module.pdf_url || "",
      id_praktikum: module.id_praktikum
    });
    
    if (!openDropdowns.includes(module.id_modul)) {
      toggleDropdown(module.id_modul);
    }
  }, [toggleDropdown, openDropdowns]);

  const handleSubmoduleClick = useCallback((submodule: Submodule) => {
    // Cari modul parent-nya berdasarkan id_modul
    const parentModule = modules.find((mod) => mod.id_modul === submodule.id_modul);
    if (parentModule) {
      // Set modul parent jika belum diset atau beda dengan modul yang sedang dipilih
      if (!selectedModule || selectedModule.id_modul !== parentModule.id_modul) {
        setSelectedModule(parentModule);
  
        // Optionally: open dropdown jika belum terbuka
        if (!openDropdowns.includes(parentModule.id_modul)) {
          toggleDropdown(parentModule.id_modul);
        }
      }
    }
  
    // Lanjut set submodule seperti biasa
    setSelectedSubmodule(submodule);
    setSelectedQuestion(null);
    setIsEditing(false);
    setIsAddingQuestion(false);
    setIsEditingQuestion(false);
    setIsAddingModule(false);
    setActiveTab("details");
  
    // Tentukan tipe video
    let videoType: "file" | "youtube" = "file";
    if (submodule.video_url && isYouTubeLink(submodule.video_url)) {
      videoType = "youtube";
    }
  
    setVideoSourceType(videoType);
  
    setFormData({
      judul_submodul: submodule.judul_submodul,
      video_url: videoType === "file" ? submodule.video_url || "" : "",
      youtube_url: videoType === "youtube" ? submodule.video_url || "" : "",
      pdf_url: submodule.pdf_url || "",
      id_modul: submodule.id_modul
    });
  
    if (isQuiz(submodule.id_submodul) && !quizQuestions[submodule.id_submodul]) {
      fetchQuizQuestions(submodule.id_submodul);
    }
  }, [modules, selectedModule, openDropdowns, toggleDropdown, fetchQuizQuestions]);
  

  const handleQuestionClick = (question: QuizQuestion) => {
    setSelectedQuestion(question);
    setIsEditingQuestion(true);
    setIsAddingQuestion(false);
    
    // Transform backend data structure to form data
    setFormData({
      question_text: question.question_text,
      options: [
        { option_text: question.options[0].option_text, is_correct: question.options[0].is_correct },
        { option_text: question.options[1].option_text, is_correct: question.options[1].is_correct },
        { option_text: question.options[2].option_text, is_correct: question.options[2].is_correct },
        { option_text: question.options[3].option_text, is_correct: question.options[3].is_correct }
      ]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData((prev: { options: any; }) => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      
      // If setting this option as correct, set others to false
      if (field === "is_correct" && value === true) {
        newOptions.forEach((opt, i) => {
          if (i !== index) {
            newOptions[i] = { ...newOptions[i], is_correct: false };
          }
        });
      }
      
      return { ...prev, options: newOptions };
    });
  };

  // Simulate file upload with progress
  const simulateUpload = async (file: File, type: string): Promise<string> => {
    return new Promise((resolve) => {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadType(type);
      
      const totalSteps = 10;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setUploadProgress(Math.round((currentStep / totalSteps) * 100));
        
        if (currentStep >= totalSteps) {
          clearInterval(interval);
          setIsUploading(false);
          
          const fileName = file.name.replace(/\s/g, "_");
  
          // 👉 Cocokkan dengan URL endpoint backend
          let url = "";
          if (type === "video") {
            url = `http://localhost:8080/server/video_file/${fileName}`;
          } else if (type === "pdf") {
            url = `http://localhost:8080/server/pdf_file/${fileName}`;
          } else {
            url = `http://localhost:8080/uploads/${type}/${fileName}`;
          }
  
          resolve(url);
        }
      }, 300);
    });
  };
  

  // Handle file uploads
  const handleFileUpload = async (type: "pdf" | "video") => {
    const fileRef = type === "pdf" ? pdfFileRef : videoFileRef;
    if (fileRef.current && fileRef.current.files && fileRef.current.files.length > 0) {
      const file = fileRef.current.files[0];
      
      try {
        const url = await simulateUpload(file, type);
        
        // Update form data with the new URL
        if (type === "pdf") {
          setFormData((prev: any) => ({ ...prev, pdf_url: url }));
        } else {
          setFormData((prev: any) => ({ ...prev, video_url: url }));
        }
        
        alert(`${type.toUpperCase()} uploaded successfully!`);
      } catch (err) {
        console.error(`Error uploading ${type}:`, err);
        alert(`Failed to upload ${type}: ${(err as Error).message}`);
      }
    }
  };

  // Add new module
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/admin/post/modul", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul_modul: formData.judul_modul,
          id_praktikum: 7
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add module");
      }

      fetchModules();
      setIsAddingModule(false);
      setFormData({ judul_modul: "", id_praktikum: 7 });
    } catch (err) {
      console.error("Error adding module:", err);
      alert(`Failed to add module: ${(err as Error).message}`);
    }
  };

  // Add new submodule
// Complete handleAddSubmodule function with fixes for YouTube links
const handleAddSubmodule = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedModule) {
    alert("Please select a module first");
    return;
  }
  
  if (!formData.judul_submodul.trim()) {
    alert("Submodule title is required");
    return;
  }
  
  // Create FormData object
  const formDataToSend = new FormData();
  
  // Add text fields
  formDataToSend.append("judul_submodul", formData.judul_submodul);
  formDataToSend.append("id_modul", selectedModule.id_modul.toString());
  
  // Handle video source based on type
  if (videoSourceType === "youtube") {
    // Ensure we have a YouTube URL
    if (!formData.youtube_url || formData.youtube_url.trim() === "") {
      alert("Please enter a valid YouTube URL");
      return;
    }
    
    console.log("Adding with YouTube type:", videoSourceType);
    console.log("YouTube URL:", formData.youtube_url);
    
    // Use the same field name that your backend expects for YouTube URLs
    formDataToSend.append("video_url", formData.youtube_url);
    formDataToSend.append("is_youtube", "true");
    
    // Add a console log to confirm what's being sent
    console.log("Form data for YouTube:", {
      video_url: formData.youtube_url,
      is_youtube: true
    });
  } else {
    // Handle file uploads
    if (videoFileRef.current?.files?.[0]) {
      formDataToSend.append("video", videoFileRef.current.files[0]);
      console.log("Attaching video:", videoFileRef.current.files[0].name);
    }
  }
  
  // Handle PDF upload consistently for both types
  if (pdfFileRef.current?.files?.[0]) {
    formDataToSend.append("file", pdfFileRef.current.files[0]);
    console.log("Attaching PDF:", pdfFileRef.current.files[0].name);
  }
  
  try {
    // Log the entire FormData for debugging
    for (const pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const response = await fetch("http://localhost:8080/admin/post/submodul/pjk", {
      method: "POST",
      body: formDataToSend,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || "Failed to add submodule");
      } catch (parseError) {
        throw new Error(`Failed to add submodule: ${response.status} ${response.statusText}`);
      }
    }
    
    const responseData = await response.json();
    console.log("Response from server:", responseData);
    
    // Refresh submodules list
    if (selectedModule) {
      fetchSubmodules(selectedModule.id_modul);
    }
    
    // Reset form state
    setIsAddingSubmodule(false);
    setFormData({
      judul_submodul: "",
      video_url: "",
      youtube_url: "",
      pdf_url: ""
    });
    setVideoSourceType("file");
    
    // Clear file inputs
    if (pdfFileRef.current) pdfFileRef.current.value = "";
    if (videoFileRef.current) videoFileRef.current.value = "";
    
    alert("Submodule added successfully!");
  } catch (err) {
    console.error("Error adding submodule:", err);
    alert(`Failed to add submodule: ${(err as Error).message}`);
  }
};

  // Add new quiz question
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmodule) {
      alert("Pilih submodul terlebih dahulu");
      return;
    }
    
    // Validasi input - pastikan pertanyaan memiliki format yang benar
    if (!formData.question_text || formData.question_text.trim() === "") {
      alert("Pertanyaan tidak boleh kosong");
      return;
    }
    
    // Minimal panjang pertanyaan (penting untuk validasi)
    if (formData.question_text.trim().length < 5) {
      alert("Pertanyaan harus minimal 5 karakter");
      return;
    }
    
    // Validasi opsi jawaban
    const validOptions = formData.options.filter((opt: { option_text: string; }) => opt.option_text.trim() !== "");
    
    if (validOptions.length < 2) {
      alert("Minimal harus ada 2 pilihan jawaban");
      return;
    }
    
    // Pastikan semua opsi memiliki minimal panjang karakter
    for (const option of validOptions) {
      if (option.option_text.trim().length < 2) {
        alert("Setiap pilihan jawaban harus minimal 2 karakter");
        return;
      }
    }
    
    // Pastikan ada satu jawaban benar
    const correctOptions = validOptions.filter((opt: { is_correct: unknown; }) => opt.is_correct);
    if (correctOptions.length === 0) {
      alert("Pilih satu jawaban benar");
      return;
    }
    
    if (correctOptions.length > 1) {
      alert("Hanya boleh ada satu jawaban benar");
      return;
    }
    
    // Memetakan setiap opsi ke opsi yang benar
    let jawaban_benar = "";
    
    // Determinasi jawaban benar berdasarkan indeks opsi yang benar
    for (let i = 0; i < formData.options.length; i++) {
      if (formData.options[i].is_correct) {
        // Tentukan huruf jawaban berdasarkan indeks (0=A, 1=B, dst)
        const jawaban_letters = ["A", "B", "C", "D"];
        jawaban_benar = jawaban_letters[i];
        break;
      }
    }
    
    // Jika tidak ada jawaban benar yang terpilih, gunakan teks dari opsi yang ditandai benar
    if (!jawaban_benar && correctOptions.length > 0) {
      jawaban_benar = correctOptions[0].option_text.trim();
    }
    
    // Siapkan data untuk dikirim - pastikan format sesuai dengan yang diharapkan backend
    const formattedData = {
      id_submodul: selectedSubmodule.id_submodul,
      pertanyaan: formData.question_text.trim(),
      pilihan_a: validOptions[0]?.option_text.trim() || "",
      pilihan_b: validOptions[1]?.option_text.trim() || "",
      pilihan_c: validOptions.length > 2 ? validOptions[2]?.option_text.trim() : "",
      pilihan_d: validOptions.length > 3 ? validOptions[3]?.option_text.trim() : "",
      jawaban_benar: jawaban_benar
    };
    
    // Log data sebelum dikirim untuk debugging
    console.log("Data yang akan dikirim:", JSON.stringify(formattedData, null, 2));
    
    try {
      const response = await fetch(`http://localhost:8080/admin/post/quiz/pjk/${selectedSubmodule.id_submodul}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      
      // First, check if the response has content
      const contentType = response.headers.get("content-type");
      const hasJsonContent = contentType && contentType.includes("application/json");
      
      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        // Only try to parse JSON if the content type is JSON
        if (hasJsonContent) {
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.error("Error parsing error response:", parseError);
            errorMessage = "Error response tidak valid";
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // For successful responses, only try to parse if there is content
      if (hasJsonContent) {
        await response.json();
      }
      
      // Reset form
      fetchQuizQuestions(selectedSubmodule.id_submodul);
      setIsAddingQuestion(false);
      setFormData({
        question_text: "",
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false }
        ]
      });
      // Tambahkan notifikasi sukses
      alert("Pertanyaan berhasil ditambahkan");
    } catch (err) {
      console.error("Error adding question:", err);
      alert(`Gagal menambahkan pertanyaan: ${(err as Error).message}`);
    }
  };

  // Update module
  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/put/modul/${selectedModule.id_modul}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul_modul: formData.judul_modul,
          video_url: formData.video_url || null,
          pdf_url: formData.pdf_url || null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update module");
      }

      fetchModules();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating module:", err);
      alert(`Failed to update module: ${(err as Error).message}`);
    }
  };

  // Update submodule
  const handleUpdateSubmodule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmodule) return;
  
    const formDataToSend = new FormData();
    formDataToSend.append("judul_submodul", formData.judul_submodul);
  
    // Handle video source based on type
    if (videoSourceType === "youtube" && formData.youtube_url) {
      // Send YouTube URL directly
      formDataToSend.append("video_url", formData.youtube_url);
      formDataToSend.append("is_youtube", "true");
    } else {
      // Handle normal file uploads
      // Append the PDF file if present
      if (pdfFileRef.current?.files?.[0]) {
        formDataToSend.append("file", pdfFileRef.current.files[0]);
      }
  
      // Append the video file if present
      if (videoFileRef.current?.files?.[0]) {
        formDataToSend.append("video", videoFileRef.current.files[0]);
      }
    }
  
    try {
      const response = await fetch(`http://localhost:8080/admin/put/submodul/pjk/${selectedSubmodule.id_submodul}`, {
        method: "PUT",
        body: formDataToSend,
      });
  
      if (!response.ok) throw new Error("Failed to update submodule");
  
      if (selectedModule) fetchSubmodules(selectedModule.id_modul);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating submodule:", err);
      alert(`Failed to update submodule: ${(err as Error).message}`);
    }
  };
  
  
  // Update quiz question
const handleUpdateQuestion = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Log the selected question to debug
  console.log("Selected Question:", selectedQuestion);
  
  // Check if selectedQuestion is valid
  if (!selectedQuestion || typeof selectedQuestion !== "object") {
    console.error("selectedQuestion is invalid:", selectedQuestion);
    alert("Invalid question selected. Please select a valid question.");
    return;
  }
  
  // ✅ Ambil ID dari id_question (hasil dari fetchQuizQuestions)
  const quizId = selectedQuestion?.id_question;
  if (!quizId) {
    console.error("No valid quiz ID found in selectedQuestion.");
    alert("Cannot find quiz ID. Please select a valid question.");
    return;
  }
  
  console.log("Extracted Quiz ID:", quizId);
  
  // Find the index of the correct option
  const correctOptionIndex = formData.options.findIndex((option: QuizOption) => option.is_correct);
  
  // Map the correct option to A, B, or C
  const jawaban_benar = 
    correctOptionIndex === 0 ? "A" : 
    correctOptionIndex === 1 ? "B" : 
    correctOptionIndex === 2 ? "C" : "";
  
  // Siapkan data untuk dikirim ke backend
  const formattedData = {
    pertanyaan: formData.question_text,
    pilihan_a: formData.options[0].option_text,
    pilihan_b: formData.options[1].option_text,
    pilihan_c: formData.options[2].option_text,
    pilihan_d: formData.options[3].option_text,
    jawaban_benar: jawaban_benar
  };
  
  try {
    const response = await fetch(`http://localhost:8080/admin/update/quiz/pjk/${quizId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || "Failed to update question");
    }
    
    // ✅ Refresh list setelah update berhasil
    if (selectedSubmodule?.id_submodul) {
      fetchQuizQuestions(selectedSubmodule.id_submodul);
    } else {
      console.error("selectedSubmodule is null or missing id_submodul");
    }
    setIsEditingQuestion(false);
    setSelectedQuestion(null);
  } catch (err) {
    console.error("Detailed Error:", err);
    alert(`Update Failed: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
  }
};
  
  
  // Delete module
  const handleDeleteModule = async () => {
    if (!selectedModule || !window.confirm(`Are you sure you want to delete module "${selectedModule.judul_modul}"? This will also delete all associated submodules.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/delete/modul/${selectedModule.id_modul}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete module");
      }

      fetchModules();
      setSelectedModule(null);
    } catch (err) {
      console.error("Error deleting module:", err);
      alert(`Failed to delete module: ${(err as Error).message}`);
    }
  };

  // Delete submodule
  const handleDeleteSubmodule = async () => {
    if (!selectedSubmodule || !window.confirm(`Are you sure you want to delete submodule "${selectedSubmodule.judul_submodul}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/delete/submodul/pjk/${selectedSubmodule.id_submodul}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submodule");
      }

      if (selectedModule) {
        fetchSubmodules(selectedModule.id_modul);
      }
      setSelectedSubmodule(null);
    } catch (err) {
      console.error("Error deleting submodule:", err);
      alert(`Failed to delete submodule: ${(err as Error).message}`);
    }
  };

  // Delete quiz question
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion || !window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/delete/quiz/pjk/${selectedQuestion.id_question}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      if (selectedSubmodule) {
        fetchQuizQuestions(selectedSubmodule.id_submodul);
      }
      setSelectedQuestion(null);
      setIsEditingQuestion(false);
    } catch (err) {
      console.error("Error deleting question:", err);
      alert(`Failed to delete question: ${(err as Error).message}`);
    }
  };

  // Helper function to determine if content is a quiz
  const isQuiz = useCallback((id_submodul: number): boolean => {
    return [3, 6, 9, 12, 15].includes(id_submodul);
  }, []);

  const handleRetry = () => {
    fetchModules();
  };

  // Helper function to render PDF viewer
  const renderPDFViewer = (pdfUrl: string) => {
    return (
      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
        <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
          <span className="font-medium flex items-center">
            <FaFilePdf className="mr-2" /> PDF Document
          </span>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-100 text-sm underline flex items-center"
          >
            <FaEye className="mr-1" /> View Full Screen
          </a>
        </div>
        <iframe 
          src={pdfUrl} 
          className="w-full h-96" 
          title="PDF Viewer"
        ></iframe>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Upload Progress Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Uploading {uploadType.toUpperCase()}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-center">{uploadProgress}% Complete</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-[#0267FE] p-4 text-white shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 mr-4 transition-all"
            aria-label="Go back"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <div className="flex items-center">
            <FaGraduationCap className="text-2xl mr-2" />
            <h1 className="text-2xl font-bold">Asprak Dashboard - Praktikum Pengenalan Jaringan Komputer</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-black bg-opacity-20 py-2 px-4 rounded-full backdrop-blur-sm">
          <FaUserCircle className="text-2xl" />
          <span className="text-lg font-medium">Admin Panel</span>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar Toggle Button for Mobile */}
        <button 
          className="lg:hidden fixed bottom-6 right-6 z-10 bg-purple-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsSidebarExpanded(prev => !prev)}
        >
          <FaBars />
        </button>

        {/* Sidebar */}
        <div 
          className={`${
            isSidebarExpanded ? "w-72 translate-x-0" : "w-20 -translate-x-0"
          } bg-white shadow-lg overflow-hidden transition-all duration-300 flex flex-col border-r border-gray-200 relative`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            {isSidebarExpanded ? (
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaBookOpen className="mr-2 text-purple-600" />
                Modules
              </h2>
            ) : (
              <span className="mx-auto text-purple-600">
                <FaBookOpen className="text-xl" />
              </span>
            )}
            <button
              onClick={() => setIsSidebarExpanded(prev => !prev)}
              className="text-purple-600 hover:bg-purple-50 p-2 rounded-full transition-colors"
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
          
          {/* Add Module Button */}
          {isSidebarExpanded && (
            <div className="p-3 border-b border-gray-100">
              <button 
                onClick={() => {
                  setIsAddingModule(true);
                  setIsAddingSubmodule(false);
                  setIsEditing(false);
                  setSelectedModule(null);
                  setSelectedSubmodule(null);
                  setFormData({ judul_modul: "", video_url: "", pdf_url: "", youtube_url: "", id_praktikum: 7 });
                }}
                className="w-full flex items-center justify-center bg-[#0267FE] hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" />
                Add New Module
              </button>
            </div>
          )}
          
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  <FaExclamationTriangle className="text-xl mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={handleRetry}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : isSidebarExpanded ? (
              <ul className="p-3 space-y-1">
                {modules.map((module) => (
                  module.judul_modul !== "Informasi" && (
                    <li key={module.id_modul} className="mb-3">
                        <div
                          className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                            selectedModule?.id_modul === module.id_modul
                              ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                              : "hover:bg-gray-50 border-l-4 border-transparent"
                          }`}
                          onClick={() => handleModuleClick(module)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleModuleClick(module);
                            }
                          }}
                          aria-label={`Pilih modul ${module.judul_modul}`}
                        >
                        <div className="flex items-center">
                          <div className="mr-3 text-purple-600 bg-purple-50 p-2 rounded-full">
                            <FaBookOpen className="text-sm" />
                          </div>
                          <div>
                            <h3 className="font-medium">{module.judul_modul}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {module.pdf_url && (
                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex items-center">
                                  <FaFilePdf className="mr-0.5 text-xs" /> PDF
                                </span>
                              )}
                              {module.video_url && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full flex items-center">
                                  <FaVideo className="mr-0.5 text-xs" /> Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleDropdown(module.id_modul);
                          }}
                          className="text-gray-500 hover:text-purple-600 p-1 rounded-full hover:bg-gray-100"
                          aria-label={openDropdowns.includes(module.id_modul) ? "Collapse module" : "Expand module"}
                        >
                          {openDropdowns.includes(module.id_modul) ? (
                            <FaChevronUp className="text-sm" />
                          ) : (
                            <FaChevronDown className="text-sm" />
                          )}
                        </button>
                      </div>
                      {openDropdowns.includes(module.id_modul) && (
                        <>
                          <ul className="ml-12 mt-1 space-y-1 border-l border-gray-200 pl-4">
                            {submodules[module.id_modul]?.length > 0 ? (
                              submodules[module.id_modul].map((submodule) => (
                              <li
                                  key={submodule.id_submodul}
                                  className={`p-2 rounded-md cursor-pointer transition-colors flex items-center ${
                                    selectedSubmodule?.id_submodul === submodule.id_submodul
                                      ? "bg-purple-50 text-purple-700"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() => handleSubmoduleClick(submodule)}
                                >
<div className="mr-2 text-purple-500">
  {isQuiz(submodule.id_submodul) ? (
    <FaQuestionCircle className="text-xs" />
  ) : (
    <FaClipboardList className="text-xs" />
  )}
</div>
                                  <div>
                                    <h4 className="text-sm">{submodule.judul_submodul}</h4>
                                    <div className="flex items-center space-x-1 mt-0.5">
                                      {submodule.pdf_url && (
                                        <span className="text-xs bg-red-50 text-red-500 px-1 py-0.5 rounded-full flex items-center">
                                          <FaFilePdf className="mr-0.5 text-xs" /> PDF
                                        </span>
                                      )}
                                      {submodule.video_url && (
                                        <span className="text-xs bg-blue-50 text-blue-500 px-1 py-0.5 rounded-full flex items-center">
                                          <FaVideo className="mr-0.5 text-xs" /> Video
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 text-sm p-2">
                                {submodules[module.id_modul] === undefined ? (
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-full animate-spin mr-2"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  "No submodules found"
                                )}
                              </li>
                            )}
                          </ul>
                          {/* Add Submodule Button */}
                          {selectedModule?.id_modul === module.id_modul && (
                            <div className="ml-12 mt-2">
                              <button
                                onClick={() => {
                                  setIsAddingSubmodule(true);
                                  setIsAddingQuestion(false);
                                  setIsEditing(false);
                                  setIsEditingQuestion(false);
                                  setFormData({
                                    judul_submodul: "",
                                    video_url: "",
                                    youtube_url: "",
                                    pdf_url: "",
                                    id_modul: module.id_modul
                                  });
                                }}
                                className="text-sm flex items-center text-purple-600 hover:text-purple-700 p-1 rounded"
                              >
                                <FaPlus className="mr-1 text-xs" />
                                Add Submodule
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  )
                ))}
              </ul>
            ) : (
              <ul className="p-2">
                {modules.map((module) => (
                  module.judul_modul !== "Informasi" && (
                    <li key={module.id_modul} className="mb-2">
                      <div
                        className={`p-2 rounded-lg cursor-pointer flex justify-center items-center transition-colors ${
                          selectedModule?.id_modul === module.id_modul
                            ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                        onClick={() => handleModuleClick(module)}
                        title={module.judul_modul}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleModuleClick(module);
                          }
                        }}
                        aria-label={`Pilih modul ${module.judul_modul}`}
                      >
                        <FaBookOpen className="text-purple-600" />
                      </div>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {isAddingModule ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Module
                </h2>
                <button
                  onClick={() => setIsAddingModule(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddModule}>
                <div className="mb-4">
                  <label htmlFor="judul_modul" className="block text-gray-700 font-medium mb-2">
                    Module Title
                  </label>
                  <input
                    type="text"
                    id="judul_modul"
                    name="judul_modul"
                    value={formData.judul_modul}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingModule(false)}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Module
                  </button>
                </div>
              </form>
            </div>
          ) : isAddingSubmodule ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Submodule to "{selectedModule?.judul_modul}"
                </h2>
                <button
                  onClick={() => setIsAddingSubmodule(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddSubmodule}>
                <div className="mb-4">
                  <label htmlFor="judul_submodul" className="block text-gray-700 font-medium mb-2">
                    Submodule Title
                  </label>
                  <input
                    type="text"
                    id="judul_submodul"
                    name="judul_submodul"
                    value={formData.judul_submodul}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Replace the existing video_url input section in both Add and Edit forms with this code */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Video Source
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="video-source-file"
                        name="video-source"
                        checked={videoSourceType === "file"}
                        onChange={() => setVideoSourceType("file")}
                        className="mr-2"
                      />
                      <label htmlFor="video-source-file">Upload Video File</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="video-source-youtube"
                        name="video-source"
                        checked={videoSourceType === "youtube"}
                        onChange={() => setVideoSourceType("youtube")}
                        className="mr-2"
                      />
                      <label htmlFor="video-source-youtube">YouTube Link</label>
                    </div>
                  </div>

                  {videoSourceType === "file" ? (
                    <>
                      <label htmlFor="video_url" className="block text-gray-700 font-medium mb-2">
                        Video File (Optional)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="video_url"
                          name="video_url"
                          value={formData.video_url}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Video will be uploaded to server"
                          disabled={videoSourceType !== "file"}
                        />
                        <div className="ml-2 flex items-center">
                          <input
                            type="file"
                            ref={videoFileRef}
                            className="hidden"
                            accept="video/*"
                            onChange={() => handleFileUpload("video")}
                          />
                          <button
                            type="button"
                            onClick={() => videoFileRef.current?.click()}
                            className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                          >
                            <FaUpload />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="youtube_url" className="block text-gray-700 font-medium mb-2">
                        YouTube Video Link
                      </label>
                      <input
                        type="text"
                        id="youtube_url"
                        name="youtube_url"
                        value={formData.youtube_url || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="pdf_url" className="block text-gray-700 font-medium mb-2">
                    PDF URL (Optional)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="pdf_url"
                      name="pdf_url"
                      value={formData.pdf_url}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="ml-2 flex items-center">
                      <input
                        type="file"
                        ref={pdfFileRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={() => handleFileUpload("pdf")}
                      />
                      <button
                        type="button"
                        onClick={() => pdfFileRef.current?.click()}
                        className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                      >
                        <FaUpload />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingSubmodule(false)}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Submodule
                  </button>
                </div>
              </form>
            </div>
          ) : isAddingQuestion ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Question to "{selectedSubmodule?.judul_submodul}"
                </h2>
                <button
                  onClick={() => setIsAddingQuestion(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <FaTimes />
                </button>
              </div>
          
              <form onSubmit={handleAddQuestion}>
                <div className="mb-4">
                  <label htmlFor="question_text" className="block text-gray-700 font-medium mb-2">
                    Question
                  </label>
                  <textarea
                    id="question_text"
                    name="question_text"
                    value={formData.question_text}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-24"
                    required
                  />
                </div>
          
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Answer Options (Select one correct answer)
                  </label>
                  {formData.options.map((option: QuizOption, index: number) => (
                    <div key={index} className="mb-3 flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`correct-${index}`}
                        name="correct-option"
                        checked={option.is_correct}
                        onChange={() => handleOptionChange(index, "is_correct", true)}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        value={option.option_text}
                        onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
          
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingQuestion(false)}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </div>
          ) : isEditingQuestion ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Question
                </h2>
                <div className="flex items-center">
                  <button
                    onClick={handleDeleteQuestion}
                    className="text-red-500 hover:text-red-700 p-2 mr-2"
                    title="Delete Question"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingQuestion(false);
                      setSelectedQuestion(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
          
              <form onSubmit={handleUpdateQuestion}>
                <div className="mb-4">
                  <label htmlFor="question_text" className="block text-gray-700 font-medium mb-2">
                    Question
                  </label>
                  <textarea
                    id="question_text"
                    name="question_text"
                    value={formData.question_text}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-24"
                    required
                  />
                </div>
          
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Answer Options (Select one correct answer)
                  </label>
                  {formData.options.map((option: QuizOption, index: number) => (
                    <div key={index} className="mb-3 flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`correct-edit-${index}`}
                        name="correct-option-edit"
                        checked={option.is_correct}
                        onChange={() => handleOptionChange(index, "is_correct", true)}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        value={option.option_text}
                        onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
          
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingQuestion(false);
                      setSelectedQuestion(null);
                    }}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Update Question
                  </button>
                </div>
              </form>
            </div>
          ) : selectedSubmodule ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <button
                      onClick={() => {
                        setSelectedSubmodule(null);
                        setSelectedQuestion(null);
                        setIsEditing(false);
                      }}
                      className="text-purple-600 hover:bg-purple-50 p-2 rounded-full mr-2"
                    >
                      <FaChevronLeft />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedSubmodule.judul_submodul}
                    </h2>
                  </div>
                  <p className="text-gray-500 ml-10">
                    {selectedModule?.judul_modul} / {selectedSubmodule.judul_submodul}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-purple-600 hover:bg-purple-50 p-2 rounded-lg mr-2"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={handleDeleteSubmodule}
                    className="flex items-center text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateSubmodule}>
                  <div className="mb-4">
                    <label htmlFor="judul_submodul" className="block text-gray-700 font-medium mb-2">
                      Submodule Title
                    </label>
                    <input
                      type="text"
                      id="judul_submodul"
                      name="judul_submodul"
                      value={formData.judul_submodul}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* Replace the existing video_url input section in both Add and Edit forms with this code */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Video Source
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="video-source-file"
                          name="video-source"
                          checked={videoSourceType === "file"}
                          onChange={() => setVideoSourceType("file")}
                          className="mr-2"
                        />
                        <label htmlFor="video-source-file">Upload Video File</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="video-source-youtube"
                          name="video-source"
                          checked={videoSourceType === "youtube"}
                          onChange={() => setVideoSourceType("youtube")}
                          className="mr-2"
                        />
                        <label htmlFor="video-source-youtube">YouTube Link</label>
                      </div>
                    </div>

                    {videoSourceType === "file" ? (
                      <>
                        <label htmlFor="video_url" className="block text-gray-700 font-medium mb-2">
                          Video File (Optional)
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            id="video_url"
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Video will be uploaded to server"
                            disabled={videoSourceType !== "file"}
                          />
                          <div className="ml-2 flex items-center">
                            <input
                              type="file"
                              ref={videoFileRef}
                              className="hidden"
                              accept="video/*"
                              onChange={() => handleFileUpload("video")}
                            />
                            <button
                              type="button"
                              onClick={() => videoFileRef.current?.click()}
                              className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                            >
                              <FaUpload />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <label htmlFor="youtube_url" className="block text-gray-700 font-medium mb-2">
                          YouTube Video Link
                        </label>
                        <input
                          type="text"
                          id="youtube_url"
                          name="youtube_url"
                          value={formData.youtube_url || ""}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="pdf_url" className="block text-gray-700 font-medium mb-2">
                      PDF URL (Optional)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="pdf_url"
                        name="pdf_url"
                        value={formData.pdf_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <div className="ml-2 flex items-center">
                        <input
                          type="file"
                          ref={pdfFileRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={() => handleFileUpload("pdf")}
                        />
                        <button
                          type="button"
                          onClick={() => pdfFileRef.current?.click()}
                          className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                        >
                          <FaUpload />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <ul className="flex space-x-6">
                      <li>
                        <button
                          onClick={() => setActiveTab("details")}
                          className={`pb-3 transition-colors ${
                            activeTab === "details"
                              ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Details
                        </button>
                      </li>
                      {isQuiz(selectedSubmodule.id_submodul) && (
                        <li>
                          <button
                            onClick={() => setActiveTab("quiz")}
                            className={`pb-3 transition-colors ${
                              activeTab === "quiz"
                                ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Quiz Questions
                          </button>
                        </li>
                      )}
                      {selectedSubmodule.video_url && (
                        <li>
                          <button
                            onClick={() => setActiveTab("video")}
                            className={`pb-3 transition-colors ${
                              activeTab === "video"
                                ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Video
                          </button>
                        </li>
                      )}
                      {selectedSubmodule.pdf_url && (
                        <li>
                          <button
                            onClick={() => setActiveTab("pdf")}
                            className={`pb-3 transition-colors ${
                              activeTab === "pdf"
                                ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            PDF
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "details" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Submodule Information
                          </h3>
                          <p className="text-gray-600 mb-4">
                            ID: {selectedSubmodule.id_submodul}
                          </p>
                          <p className="text-gray-600 mb-4">
                            Title: {selectedSubmodule.judul_submodul}
                          </p>
                          <p className="text-gray-600 mb-4">
                            Type: {isQuiz(selectedSubmodule.id_submodul) ? "Quiz" : "Learning Material"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Resources
                          </h3>
                          <p className="text-gray-600 mb-2 flex items-center">
                            <FaVideo className="mr-2 text-blue-500" /> 
                            Video: {selectedSubmodule.video_url ? (
                              <a 
                                href={selectedSubmodule.video_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-1"
                              >
                                View Video
                              </a>
                            ) : "Not Available"}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <FaFilePdf className="mr-2 text-red-500" />
                            PDF: {selectedSubmodule.pdf_url ? (
                              <a 
                                href={selectedSubmodule.pdf_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-1"
                              >
                                View PDF
                              </a>
                            ) : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "quiz" && isQuiz(selectedSubmodule.id_submodul) && (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Quiz Questions</h3>
                        <button
                          onClick={() => {
                            setIsAddingQuestion(true);
                            setIsEditingQuestion(false);
                            setSelectedQuestion(null);
                            setFormData({
                              question_text: "",
                              options: [
                                { option_text: "", is_correct: false },
                                { option_text: "", is_correct: false },
                                { option_text: "", is_correct: false },
                                { option_text: "", is_correct: false }
                              ]
                            });
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                        >
                          <FaPlus className="mr-2" />
                          Add Question
                        </button>
                      </div>

                      {!quizQuestions[selectedSubmodule.id_submodul] ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      ) : quizQuestions[selectedSubmodule.id_submodul].length === 0 ? (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <FaQuestion className="text-3xl text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No quiz questions found. Add your first question!</p>
                        </div>
                      ) : (
                  <div className="space-y-4">
                    {quizQuestions[selectedSubmodule.id_submodul]?.map((question, qIndex) => {
                      // Pastikan question dan options ada
                      if (!question || !Array.isArray(question.options)) {
                        console.warn("Invalid question data:", question);
                        return null;
                      }

                      return (
                        <div
                          key={`question-${question.id_question || qIndex}`}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleQuestionClick(question)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <p className="font-medium text-gray-800 mb-3">
                                {qIndex + 1}. {question.question_text}
                              </p>
                              <ul className="ml-4 space-y-1">
                                {question.options.length > 0 ? (
                                  question.options.map((option, oIndex) => (
                                    <li
                                      key={`option-${question.id_question}-${option.id_option || oIndex}`}
                                      className={`flex items-center py-1 ${
                                        option.is_correct ? "text-green-600 font-medium" : "text-gray-600"
                                      }`}
                                    >
                                      <span className="mr-2 w-5">
                                        {option.is_correct ? (
                                          <FaCheck className="text-green-500" />
                                        ) : (
                                          <FaTimes className="text-gray-400" />
                                        )}
                                      </span>
                                      <span className="flex-grow">
                                        {String.fromCharCode(97 + oIndex)}. {option.option_text}
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-gray-500">No options available</li>
                                )}
                              </ul>
                            </div>
                            <div className="ml-4">
                              <FaEdit className="text-purple-500" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                      )}
                    </div>
                  )}

                  {activeTab === "video" && selectedSubmodule?.video_url && (
                    <div>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
                          <span className="font-medium flex items-center">
                            <FaVideo className="mr-2" /> Video Content
                          </span>
                          <a 
                            href={selectedSubmodule.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-100 text-sm underline"
                          >
                            Open in New Tab
                          </a>
                        </div>
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe 
                            src={isYouTubeLink(selectedSubmodule.video_url) 
                              ? getYouTubeEmbedUrl(selectedSubmodule.video_url)
                              : selectedSubmodule.video_url} 
                            className="w-full h-96 border-0" 
                            allowFullScreen
                            title="Video Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "pdf" && selectedSubmodule.pdf_url && (
                    <div>
                      {renderPDFViewer(selectedSubmodule.pdf_url)}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : selectedModule ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedModule.judul_modul}
                  </h2>
                  <p className="text-gray-500">Module ID: {selectedModule.id_modul}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-purple-600 hover:bg-purple-50 p-2 rounded-lg mr-2"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={handleDeleteModule}
                    className="flex items-center text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateModule}>
                  <div className="mb-4">
                    <label htmlFor="judul_modul" className="block text-gray-700 font-medium mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      id="judul_modul"
                      name="judul_modul"
                      value={formData.judul_modul}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* Replace the existing video_url input section in both Add and Edit forms with this code */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Video Source
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="video-source-file"
                          name="video-source"
                          checked={videoSourceType === "file"}
                          onChange={() => setVideoSourceType("file")}
                          className="mr-2"
                        />
                        <label htmlFor="video-source-file">Upload Video File</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="video-source-youtube"
                          name="video-source"
                          checked={videoSourceType === "youtube"}
                          onChange={() => setVideoSourceType("youtube")}
                          className="mr-2"
                        />
                        <label htmlFor="video-source-youtube">YouTube Link</label>
                      </div>
                    </div>

                    {videoSourceType === "file" ? (
                      <>
                        <label htmlFor="video_url" className="block text-gray-700 font-medium mb-2">
                          Video File (Optional)
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            id="video_url"
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Video will be uploaded to server"
                            disabled={videoSourceType !== "file"}
                          />
                          <div className="ml-2 flex items-center">
                            <input
                              type="file"
                              ref={videoFileRef}
                              className="hidden"
                              accept="video/*"
                              onChange={() => handleFileUpload("video")}
                            />
                            <button
                              type="button"
                              onClick={() => videoFileRef.current?.click()}
                              className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                            >
                              <FaUpload />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <label htmlFor="youtube_url" className="block text-gray-700 font-medium mb-2">
                          YouTube Video Link
                        </label>
                        <input
                          type="text"
                          id="youtube_url"
                          name="youtube_url"
                          value={formData.youtube_url || ""}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="pdf_url" className="block text-gray-700 font-medium mb-2">
                      PDF URL (Optional)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="pdf_url"
                        name="pdf_url"
                        value={formData.pdf_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <div className="ml-2 flex items-center">
                        <input
                          type="file"
                          ref={pdfFileRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={() => handleFileUpload("pdf")}
                        />
                        <button
                          type="button"
                          onClick={() => pdfFileRef.current?.click()}
                          className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200"
                        >
                          <FaUpload />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <ul className="flex space-x-6">
                      <li>
                        <button
                          onClick={() => setActiveTab("details")}
                          className={`pb-3 transition-colors ${
                            activeTab === "details"
                              ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Details
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setActiveTab("submodules")}
                          className={`pb-3 transition-colors ${
                            activeTab === "submodules"
                              ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Submodules
                        </button>
                      </li>
                      {selectedModule.video_url && (
                        <li>
                          <button
                            onClick={() => setActiveTab("video")}
                            className={`pb-3 transition-colors ${
                              activeTab === "video"
                                ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Video
                          </button>
                        </li>
                      )}
                      {selectedModule.pdf_url && (
                        <li>
                          <button
                            onClick={() => setActiveTab("pdf")}
                            className={`pb-3 transition-colors ${
                              activeTab === "pdf"
                                ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            PDF
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "details" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Module Information
                          </h3>
                          <p className="text-gray-600 mb-4">
                            ID: {selectedModule.id_modul}
                          </p>
                          <p className="text-gray-600 mb-4">
                            Title: {selectedModule.judul_modul}
                          </p>
                          <p className="text-gray-600 mb-4">
                            Praktikum ID: {selectedModule.id_praktikum}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Resources
                          </h3>
                          <p className="text-gray-600 mb-2 flex items-center">
                            <FaVideo className="mr-2 text-blue-500" /> 
                            Video: {selectedModule.video_url ? (
                              <a 
                                href={selectedModule.video_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-1"
                              >
                                View Video
                              </a>
                            ) : "Not Available"}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <FaFilePdf className="mr-2 text-red-500" />
                            PDF: {selectedModule.pdf_url ? (
                              <a 
                                href={selectedModule.pdf_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-1"
                              >
                                View PDF
                              </a>
                            ) : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "submodules" && (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Submodules</h3>
                        <button
                          onClick={() => {
                            setIsAddingSubmodule(true);
                            setIsEditing(false);
                            setFormData({
                              judul_submodul: "",
                              video_url: "",
                              youtube_url: "",
                              pdf_url: "",
                              id_modul: selectedModule.id_modul
                            });
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                        >
                          <FaPlus className="mr-2" />
                          Add Submodule
                        </button>
                      </div>

                      {!submodules[selectedModule.id_modul] ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      ) : submodules[selectedModule.id_modul].length === 0 ? (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <FaBookOpen className="text-3xl text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No submodules found. Add your first submodule!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {submodules[selectedModule.id_modul].map((submodule) => (
                            <div
                              key={submodule.id_submodul}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleSubmoduleClick(submodule)}
                            >
                              <div className="flex items-center mb-2">
                                {isQuiz(submodule.id_submodul) ? (
                                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                    <FaClipboardList className="text-yellow-600" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <FaPlayCircle className="text-blue-600" />
                                  </div>
                                )}
                                <h4 className="font-medium text-gray-800">{submodule.judul_submodul}</h4>
                              </div>
                              <div className="flex items-center mt-3 text-sm">
                                {submodule.video_url && (
                                  <span className="mr-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center">
                                    <FaVideo className="mr-1 text-xs" /> Video
                                  </span>
                                )}
                                {submodule.pdf_url && (
                                  <span className="mr-2 bg-red-50 text-red-600 px-2 py-0.5 rounded-full flex items-center">
                                    <FaFilePdf className="mr-1 text-xs" /> PDF
                                  </span>
                                )}
                                {isQuiz(submodule.id_submodul) && (
                                  <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full flex items-center">
                                    <FaQuestion className="mr-1 text-xs" /> Quiz
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "video" && selectedModule?.video_url && (
                    <div>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
                          <span className="font-medium flex items-center">
                            <FaVideo className="mr-2" /> Video Content
                          </span>
                          <a 
                            href={selectedModule.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-100 text-sm underline"
                          >
                            Open in New Tab
                          </a>
                        </div>
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe 
                            src={isYouTubeLink(selectedModule.video_url) 
                              ? getYouTubeEmbedUrl(selectedModule.video_url)
                              : selectedModule.video_url} 
                            className="w-full h-96 border-0" 
                            allowFullScreen
                            title="Video Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "pdf" && selectedModule.pdf_url && (
                    <div>
                      {renderPDFViewer(selectedModule.pdf_url)}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <FaGraduationCap className="mx-auto text-5xl text-purple-200 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Pengenalan Jaringan Komputer Praktikum Admin Panel
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                  Select a module from the sidebar to manage content or add a new module to get started.
                </p>
                <button
                  onClick={() => {
                    setIsAddingModule(true);
                    setFormData({ judul_modul: "", video_url: "", pdf_url: "", youtube_url: "", id_praktikum: 9 });
                  }}
                  className="bg-[#0267FE] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add New Module
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
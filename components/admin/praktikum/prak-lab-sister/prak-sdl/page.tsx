"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";  
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
  FaBookmark,
  FaUserShield
} from "react-icons/fa";
import Modul_1_SDL from "./modul/modul1";
import Modul_2_SDL from "./modul/modul2";
import Modul_3_SDL from "./modul/modul3";
import Modul_4_SDL from "./modul/modul4";
import Modul_5_SDL from "./modul/modul5";
import Quiz_1_SDL from "./quiz/quiz1";
import Quiz_2_SDL from "./quiz/quiz2";
import Quiz_3_SDL from "./quiz/quiz3";
import Quiz_4_SDL from "./quiz/quiz4";
import Quiz_5_SDL from "./quiz/quiz5";


// Define interfaces for type safety
interface Module {
  id_modul: number;
  judul_modul: string;
  video_url?: string;
}

interface Submodule {
  id_submodul: number;
  judul_submodul: string;
  video_url?: string;
  pdf_url?: string;
}

interface ModuleProgress {
  completed: boolean;
  progress: number;
}

interface SubmodulesMap {
  [moduleId: number]: Submodule[];
}

interface ProgressMap {
  [moduleId: number]: ModuleProgress;
}

interface ApiResponse<T> {
  data: T;
  status?: string;
  message?: string;
}

function PrakEldasPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<Submodule | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const [submodules, setSubmodules] = useState<SubmodulesMap>({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const router = useRouter();

  // Fetch modules data
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/praktikum/modul/12");
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const data = await response.json() as ApiResponse<Module[]>;
      if (!data.data) {
        throw new Error("Invalid data structure received from server");
      }
      setModules(data.data);
      // Initialize progress tracking
      const initialProgress: ProgressMap = {};
      data.data.forEach(module => {
        initialProgress[module.id_modul] = {
          completed: false,
          progress: 0
        };
      });
      setProgress(initialProgress);
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
      const response = await fetch(`http://localhost:8080/api/praktikum/submodul/prak-sdl/${moduleId}`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json() as ApiResponse<Submodule[]>;
      setSubmodules(prev => ({ ...prev, [moduleId]: data.data || [] }));
    } catch (err) {
      console.error(`Error fetching submodules for module ${moduleId}:`, err);
      // Show error but don't set global error state
      setSubmodules(prev => ({ ...prev, [moduleId]: [] }));
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

  const handleModuleClick = useCallback((module: Module) => {
    setSelectedModule(module);
    setSelectedSubmodule(null);
    toggleDropdown(module.id_modul);
    
    // Simulate increasing progress when viewing a module
    setProgress(prev => ({
      ...prev,
      [module.id_modul]: {
        ...prev[module.id_modul],
        progress: Math.min(100, (prev[module.id_modul]?.progress || 0) + 10)
      }
    }));
  }, [toggleDropdown]);

  const handleSubmoduleClick = useCallback((submodule: Submodule) => {
    setSelectedSubmodule(submodule);
    
    // Simulate completing a submodule when clicked
    if (selectedModule) {
      setProgress(prev => ({
        ...prev,
        [selectedModule.id_modul]: {
          ...prev[selectedModule.id_modul],
          progress: Math.min(100, (prev[selectedModule.id_modul]?.progress || 0) + 20)
        }
      }));
    }
  }, [selectedModule]);

  const currentVideoUrl = selectedSubmodule?.video_url || selectedModule?.video_url || null;

  const renderSubmoduleComponent = useCallback((id_submodul: number) => {
    // Make sure pdfUrl is string | null, not undefined
    const pdfUrl: string | null = selectedSubmodule?.pdf_url || null;
    
    switch (id_submodul) {
      case 2: return <Modul_1_SDL pdfUrl={pdfUrl} />;
      case 3: return <Quiz_1_SDL submodulId={selectedSubmodule?.id_submodul ?? 0} userId={1} />;
      case 5: return <Modul_2_SDL pdfUrl={pdfUrl} />;
      case 6: return <Quiz_2_SDL submodulId={selectedSubmodule?.id_submodul ?? 0} userId={2} />;
      case 8: return <Modul_3_SDL pdfUrl={pdfUrl} />;
      case 9: return <Quiz_3_SDL submodulId={selectedSubmodule?.id_submodul ?? 0} userId={3} />;
      case 11: return <Modul_4_SDL pdfUrl={pdfUrl} />;
      case 12: return <Quiz_4_SDL submodulId={selectedSubmodule?.id_submodul ?? 0} userId={4} />;
      case 14: return <Modul_5_SDL pdfUrl={pdfUrl} />;
      case 15: return <Quiz_5_SDL submodulId={selectedSubmodule?.id_submodul ?? 0} userId={5} />;
      default: return null;
    }
  }, [selectedSubmodule]);


  // Helper function to determine if content is a quiz
  const isQuiz = useCallback((id_submodul: number): boolean => {
    return [3, 6, 9, 12, 15].includes(id_submodul);
  }, []);

  // Retry loading if there was an error
  const handleRetry = () => {
    fetchModules();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-800 p-4 text-white shadow-lg">
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
            <h1 className="text-2xl font-bold">Praktikum SDL</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-opacity-10 py-2 px-4 rounded-full backdrop-blur-sm">
          {/* <FaUserCircle className="text-2xl" />
          <span className="text-lg font-medium">Admin 1234567</span> */}
                    {/* Admin Dashboard Button */}
                    <Link
            href={"/praktikum/prak-lab-sister/prak-sdl/admin"}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition-colors"
          >
            <FaUserShield className="mr-2" />
            <span>Admin Dashboard</span>
          </Link>
          
          {/* User Info */}
          <div className="bg-black bg-opacity-20 py-2 px-4 rounded-full backdrop-blur-sm">
            <FaUserCircle className="text-2xl" />
            <span className="text-lg font-medium">Admin 1234567</span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar Toggle Button for Mobile (hidden on larger screens) */}
        <button 
          className="lg:hidden fixed bottom-6 right-6 z-10 bg-blue-600 text-white p-3 rounded-full shadow-lg"
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
                <FaBookOpen className="mr-2 text-blue-600" />
                Modules
              </h2>
            ) : (
              <span className="mx-auto text-blue-600">
                <FaBookOpen className="text-xl" />
              </span>
            )}
            <button
              onClick={() => setIsSidebarExpanded(prev => !prev)}
              className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  <FaExclamationTriangle className="text-xl mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={handleRetry}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
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
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                        onClick={() => handleModuleClick(module)}
                      >
                        <div className="flex items-center">
                          <div className="mr-3 text-blue-600 bg-blue-50 p-2 rounded-full">
                            <FaBookOpen className="text-sm" />
                          </div>
                          <div>
                            <h3 className="font-medium">{module.judul_modul}</h3>
                            {/* Progress bar */}
                            <div className="w-32 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${progress[module.id_modul]?.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleDropdown(module.id_modul);
                          }}
                          className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
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
                        <ul className="ml-12 mt-1 space-y-1 border-l border-gray-200 pl-4">
                          {submodules[module.id_modul]?.length > 0 ? (
                            submodules[module.id_modul].map((submodule) => (
                              <li
                                key={submodule.id_submodul}
                                className={`p-2 rounded-md cursor-pointer flex items-center transition-colors ${
                                  selectedSubmodule?.id_submodul === submodule.id_submodul
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                                onClick={() => handleSubmoduleClick(submodule)}
                              >
                                <div className={`p-1 rounded-md mr-2 ${
                                  isQuiz(submodule.id_submodul)
                                    ? "bg-green-50 text-green-500"
                                    : submodule.judul_submodul.toLowerCase().includes("ringkasan")
                                      ? "bg-amber-50 text-amber-500"
                                      : "bg-blue-50 text-blue-500"
                                }`}>
                                  {isQuiz(submodule.id_submodul) ? (
                                    <FaClipboardList className="text-xs" />
                                  ) : submodule.judul_submodul.toLowerCase().includes("ringkasan") ? (
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      viewBox="0 0 24 24" 
                                      className="text-xs"
                                      width="1em"
                                      height="1em"
                                    >
                                      <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.2" />
                                      <path d="M7 4C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V9L13 4H7Z" fill="currentColor" />
                                      <path d="M13 4V9H18L13 4Z" fill="white" />
                                      <rect x="8" y="11" width="8" height="1.5" rx="0.75" fill="white" />
                                      <rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="white" />
                                      <rect x="8" y="17" width="5" height="1.5" rx="0.75" fill="white" />
                                    </svg>
                                  ) : (
                                    <FaPlayCircle className="text-xs" />
                                  )}
                                </div>
                                <span className="text-sm">{submodule.judul_submodul}</span>
                                {/* Bookmark indicator */}
                                {submodule.id_submodul % 3 === 0 && (
                                  <FaBookmark className="ml-auto text-xs text-amber-500" />
                                )}
                              </li>
                            ))
                          ) : submodules[module.id_modul] === undefined ? (
                            <li className="p-2 text-gray-400 text-sm">
                              <div className="animate-pulse flex items-center">
                                <div className="h-2 w-full bg-gray-200 rounded"></div>
                              </div>
                            </li>
                          ) : (
                            <li className="p-2 text-gray-400 text-sm italic">No submodules available</li>
                          )}
                        </ul>
                      )}
                    </li>
                  )
                ))}
              </ul>
            ) : (
              <ul className="py-4">
                {modules.map((module) => (
                  module.judul_modul !== "Informasi" && (
                    <li key={module.id_modul} className="mb-2">
                      <div
                        className={`p-3 cursor-pointer flex flex-col items-center justify-center transition-colors ${
                          selectedModule?.id_modul === module.id_modul 
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                        onClick={() => handleModuleClick(module)}
                        title={module.judul_modul}
                      >
                        <div className="bg-blue-50 p-2 rounded-full mb-1">
                          <FaBookOpen className="text-blue-600" />
                        </div>
                        <div className="h-1 w-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${progress[module.id_modul]?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Content header */}
            {(selectedModule || selectedSubmodule) && (
              <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col">
                  {selectedModule && !selectedSubmodule && (
                    <>
                      <div className="flex items-center mb-1">
                        <span className="text-sm bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full">
                          Module
                        </span>
                        {progress[selectedModule.id_modul]?.progress >= 80 && (
                          <span className="text-sm bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full ml-2">
                            Almost Complete
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedModule.judul_modul}</h2>
                    </>
                  )}
                  {selectedSubmodule && (
                    <>
                      <div className="flex items-center mb-1">
                        <span className={`text-sm font-semibold py-1 px-3 rounded-full ${
                          isQuiz(selectedSubmodule.id_submodul) 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {isQuiz(selectedSubmodule.id_submodul) ? "Quiz" : "Lesson"}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedSubmodule.judul_submodul}</h2>
                      {selectedModule && (
                        <span className="text-gray-500 mt-1 flex items-center">
                          <FaBookOpen className="text-xs mr-1" />
                          From: {selectedModule.judul_modul}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Video player and content */}
            <div className="p-6">
              {currentVideoUrl ? (
                <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-gray-200">
                  <video 
                    key={currentVideoUrl} 
                    controls 
                    className="w-full"
                    poster="/api/placeholder/1200/675" // Placeholder image for video
                  >
                    <source src={currentVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Digital Systems Lab</span>
                    <div className="flex items-center space-x-4">
                      
                      <button className="text-blue-600 hover:underline text-sm">Download</button>
                      <button className="text-blue-600 hover:underline text-sm">Transcript</button>
                    </div>
                  </div>
                </div>
              ) : (!selectedModule && !selectedSubmodule) && (
                <div className="text-center py-16 px-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full transform scale-150 opacity-30 blur-3xl"></div>
                    <div className="relative">
                      <div className="inline-flex justify-center items-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 text-white">
                        <FaGraduationCap className="text-3xl" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">Welcome to Praktikum Eldas</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Select a module from the sidebar to begin your digital systems laboratory journey. Track your progress and complete quizzes to test your knowledge.
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          View Introduction
                        </button>
                        <button className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                          Browse Modules
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedSubmodule && (
                <div className="bg-white rounded-xl transition-all">
                  {renderSubmoduleComponent(selectedSubmodule.id_submodul)}
                </div>
              )}
              
              {selectedModule && !selectedSubmodule && !currentVideoUrl && (
                <div className="text-center py-10 px-6 bg-gray-50 rounded-xl">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
                    <FaBookOpen className="text-blue-600 text-3xl mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Module Overview</h3>
                    <p className="text-gray-600 mb-4">
                      This module contains multiple lessons and quiz materials. Select a specific lesson or quiz from the sidebar to begin learning.
                    </p>
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-start">
                      <div className="mt-1 mr-3 text-blue-500">
                        <FaExclamationTriangle />
                      </div>
                      <p>
                        Lets Learning!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrakEldasPage;
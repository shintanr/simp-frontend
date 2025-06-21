// app/submission_praktikan/preview/[id]/page.tsx
"use client";

import FileViewer from '@/components/ui/ui/filepreview';
import Header from "@/components/ui/ui/header";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PreviewFilePage = () => {
  const params = useParams();
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchFileDetails = async () => {
      try {
        const id = params.id; // Menggunakan params.id karena folder dinamis sekarang bernama [id]
        
        if (!id) {
          setError('ID file tidak ditemukan');
          return;
        }

        if (id === 'undefined') {
          setError('ID submission tidak valid atau tidak ditemukan');
          return;
        }

        // Simulasi progress
        intervalId = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + 10;
          });
        }, 100);

        // Gunakan endpoint existing yang sudah ada
        const viewUrl = `http://localhost:8080/api/submission/view/${id}`;
        console.log('Fetching URL:', viewUrl); // Debugging
        
        // Test endpoint first
        const response = await fetch(viewUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('File tidak ditemukan atau tidak dapat diakses');
        }

        const contentType = response.headers.get('content-type');
        let fileExtension = '';
        
        if (contentType?.includes('pdf')) {
          fileExtension = 'pdf';
        } else if (contentType?.includes('msword') || contentType?.includes('wordprocessingml')) {
          fileExtension = 'docx';
        } else {
          // Fallback to parsing from content type
          fileExtension = contentType?.split('/').pop()?.toLowerCase() || '';
        }

        setFileUrl(viewUrl);
        setFileType(fileExtension);
        setProgress(100);
      } catch (err) {
        console.error('Error fetching file:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat file');
      } finally {
        setLoading(false);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    fetchFileDetails();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-64 bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">Memuat file... {progress}%</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Gagal Memuat File
            </h3>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <button 
              onClick={() => router.back()} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative">
        <div className="fixed top-20 left-4 z-50">
          <button 
            onClick={() => router.back()} 
            className="bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50 flex items-center group transition-all duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
        <div className="mt-16"> {/* Adjusted margin untuk memberikan space yang cukup dari header */}
          <FileViewer fileUrl={fileUrl} fileType={fileType} />
        </div>
      </div>
    </div>
  );
};

export default PreviewFilePage;
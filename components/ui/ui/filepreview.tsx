import React, { useState } from 'react';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType }) => {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-red-500 font-bold mb-2">Error loading file</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // PDF Preview
  if (fileType === 'pdf') {
    return (
      <div className="h-screen w-full">
        <iframe
          src={`${fileUrl}#view=FitH`}
          className="w-full h-full"
          title="PDF Viewer"
          onError={() => setError('Failed to load PDF')}
        />
      </div>
    );
  }

  // Word Document Preview menggunakan Office Viewer
  if (fileType === 'doc' || fileType === 'docx') {
    // Gunakan absolute URL untuk Office Viewer
    const fullUrl = window.location.origin + fileUrl;
    const encodedUrl = encodeURIComponent(fullUrl);
    
    return (
      <div className="h-screen w-full">
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
          className="w-full h-full"
          title="Document Viewer"
          onError={() => setError('Failed to load document')}
        />
      </div>
    );
  }

  // Fallback untuk file type lain
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="mb-4">Preview not available for this file type</p>
        <a 
          href={fileUrl} 
          download 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download File
        </a>
      </div>
    </div>
  );
};

export default FileViewer;
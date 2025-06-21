'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center justify-between z-50">
      <div className="flex items-center space-x-3">
        <Download className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-medium text-sm">Install SIMP</p>
          <p className="text-xs text-gray-600">Install aplikasi untuk akses lebih mudah</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleInstallClick}
          size="sm"
          className="text-xs"
        >
          Install
        </Button>
        <Button 
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
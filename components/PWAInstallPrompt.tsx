'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user has dismissed the prompt before
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 3 seconds delay for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        toast.success('WasteNexus installed successfully!', {
          description: 'You can now access the app from your home screen.',
        });
      } else {
        toast.info('Installation cancelled', {
          description: 'You can install later from your browser menu.',
        });
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Install prompt error:', error);
      toast.error('Installation failed. Please try again.');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    toast.info('Install prompt hidden', {
      description: 'You can still install from your browser menu.',
    });
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <>
      {/* Mobile prompt - Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg md:hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install WasteNexus App</p>
            <p className="text-xs text-green-50 truncate">
              Get instant access & work offline
            </p>
          </div>
          <Button
            onClick={handleInstall}
            size="sm"
            className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4"
          >
            Install
          </Button>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-green-700 rounded"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop prompt - Top-right notification */}
      <div className="hidden md:block fixed top-20 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-right duration-300">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Install WasteNexus
                </h3>
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Install our app for quick access, offline support, and a better experience.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

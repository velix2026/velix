// components/AdminPWAProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PWAContextType {
  deferredPrompt: any;
  showInstall: boolean;
  handleInstall: () => void;
  notificationPermission: NotificationPermission | null;
  requestNotificationPermission: () => void;
  isOnline: boolean;
  isAuthenticated: boolean;
}

const PWAContext = createContext<PWAContextType>({
  deferredPrompt: null,
  showInstall: false,
  handleInstall: () => {},
  notificationPermission: null,
  requestNotificationPermission: () => {},
  isOnline: true,
  isAuthenticated: false,
});

export const usePWA = () => useContext(PWAContext);

export default function AdminPWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ التحقق من صلاحية الأدمن
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // ✅ التعامل مع حدث التثبيت
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result: any) => {
        if (result.outcome === 'accepted') {
          console.log('✅ Admin app installed');
        }
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <PWAContext.Provider
      value={{
        deferredPrompt,
        showInstall,
        handleInstall,
        notificationPermission,
        requestNotificationPermission,
        isOnline,
        isAuthenticated,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}
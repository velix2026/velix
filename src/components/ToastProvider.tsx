'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Toast from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idCounterRef = useRef(0);

  const generateUniqueId = () => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}`;
  };

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateUniqueId();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, type = 'info' } = event.detail;
      showToast(message, type);
    };

    window.addEventListener('showToast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, [showToast]);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Toast from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  orderId?: string;
  whatsappLink?: string;
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idCounterRef = useRef(0);

  const generateUniqueId = () => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}`;
  };

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', orderId?: string, whatsappLink?: string) => {
    const id = generateUniqueId();
    const newToast: ToastMessage = { id, message, type, orderId, whatsappLink };
    
    setToasts(prev => [...prev, newToast]);
    
    const duration = orderId ? 10000 : 3000;
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, type = 'info', orderId, whatsappLink } = event.detail;
      showToast(message, type, orderId, whatsappLink);
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
          orderId={toast.orderId}
          whatsappLink={toast.whatsappLink}
        />
      ))}
    </>
  );
}
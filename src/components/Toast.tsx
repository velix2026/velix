// components/Toast.tsx
'use client';

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
  isVisible?: boolean;
}

export default function Toast({ 
  message, 
  type, 
  onClose, 
  duration = 3000,
  isVisible = true 
}: ToastProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscKey);

    const liveRegion = document.getElementById('toast-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [duration]);

  const handleClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onClose();
  };
  const bgColor = {
    success: 'bg-linear-to-r from-emerald-500 via-green-500 to-lime-400',
    error: 'bg-linear-to-r from-red-500 via-rose-500 to-pink-500',
    info: 'bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500',
    warning: 'bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500',
  }[type];

  const borderColor = {
    success: 'border-emerald-300',
    error: 'border-red-300',
    info: 'border-blue-300',
    warning: 'border-amber-300',
  }[type];

  const icons = {
    success: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  }[type];

  if (!isVisible) return null;

  return (
    <>
      <div id="toast-live-region" className="sr-only" aria-live="polite" aria-atomic="true" />
      
      <div
        ref={toastRef}
        role="alert"
        aria-label={`إشعار: ${message}`}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-9999 animate-slide-down cursor-pointer"
        onClick={handleClose}
      >
        <div className={`
          ${bgColor} 
          text-white 
          px-5 
          py-3 
          rounded-full 
          shadow-2xl 
          flex 
          items-center 
          gap-3 
          text-sm 
          font-medium
          backdrop-blur-sm
          border
          ${borderColor}
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-xl
          group
          min-w-50
          max-w-[90vw]
          md:max-w-md
        `}>
          <div className="shrink-0">
            {icons}
          </div>
          <span className="wrap-break-word text-center">{message}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="shrink-0 mr-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
            aria-label="إغلاق الإشعار"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
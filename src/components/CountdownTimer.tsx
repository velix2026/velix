'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate?: string;
  title?: string;
  subtitle?: string;
}

function getTimeRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function getInitialTarget(propTargetDate?: string): Date | null {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('velix_countdown_target') : null;
  const dateStr = propTargetDate || stored;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      if (!propTargetDate && typeof window !== 'undefined') {
        localStorage.setItem('velix_countdown_target', dateStr);
      }
      return d;
    }
  }
  return null;
}

export default function CountdownTimer({ targetDate: propTargetDate, title, subtitle }: CountdownTimerProps) {
  const [target, setTarget] = useState<Date | null>(() => getInitialTarget(propTargetDate));
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!target) return;
    const tick = () => setTime(getTimeRemaining(target!));
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [target]);

  if (!target) return null;

  if (time.expired) {
    return (
      <section className="bg-linear-to-r from-rose-gold-dark via-rose-gold to-copper py-8 md:py-12 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-white/90 text-sm font-bold mb-2 tracking-widest">🔥</span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2">التشكيلة الجديدة نزلت!</h2>
            <p className="text-white/80 font-bold text-base mb-6">أحدث التصميمات في انتظارك. جهز نفسك!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-rose-gold-dark font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
            >
              تسوق التشكيلة الجديدة
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  const units = [
    { label: 'يوم', value: time.days },
    { label: 'ساعة', value: time.hours },
    { label: 'دقيقة', value: time.minutes },
    { label: 'ثانية', value: time.seconds },
  ];

  return (
    <section className="bg-linear-to-r from-rose-gold/5 via-copper/5 to-rose-gold/5 py-10 md:py-14 overflow-hidden border-b border-rose-gold/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          {title && (
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-2 block">
              {title}
            </span>
          )}
          <h3 className="text-xl md:text-3xl font-black text-black flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
            {subtitle || 'التشكيلة الجديدة قربت تنزل'}
          </h3>
          <div className="w-16 h-0.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-3" />
        </div>

        <div className="flex justify-center gap-3 md:gap-6" dir="ltr">
          <AnimatePresence mode="popLayout">
            {units.map((unit) => (
              <motion.div
                key={unit.label}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  key={`${unit.label}-${unit.value}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-lg border border-rose-gold/20 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                >
                  <span className="text-xl md:text-3xl font-black bg-linear-to-r from-rose-gold-light via-rose-gold to-copper bg-clip-text text-transparent">
                    {toArabicNumber(unit.value.toString().padStart(2, '0'))}
                  </span>
                </motion.div>
                <span className="text-xs md:text-sm font-bold text-black/60 mt-1.5">{unit.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

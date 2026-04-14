'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-b from-[#1A1A1A] to-[#0A0A0A]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <div className="relative w-48 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-rose-gold/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-full h-full flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-linear-to-r from-rose-gold-light via-rose-gold to-copper bg-clip-text whitespace-nowrap">
              VELIX
            </h1>
          </div>
        </div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          أهلًا بيك في VELIX
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/60 text-sm max-w-xs mx-auto"
        >
          فخامة تسوق تستحقها .. وهنغير مفهوم الموضة في مصر
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="w-2 h-2 rounded-full bg-rose-gold"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
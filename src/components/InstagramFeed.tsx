'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const PHOTOS = [
  { id: 1, label: 'هوديز VELIX', likes: 124 },
  { id: 2, label: 'تشكيلة جديدة', likes: 89 },
  { id: 3, label: 'تيشرتات قطن', likes: 256 },
  { id: 4, label: 'إطلالة كاملة', likes: 67 },
  { id: 5, label: 'شروال مريح', likes: 198 },
  { id: 6, label: 'جواكت شتوية', likes: 45 },
  { id: 7, label: 'جينز كلاسيك', likes: 312 },
  { id: 8, label: 'شوزات رياضية', likes: 78 },
  { id: 9, label: 'إكسسوارات', likes: 134 },
];

export default function InstagramFeed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleOpenInstagram = () => {
    window.open('https://instagram.com/velixstore.eg', '_blank');
  };

  return (
    <section className="bg-linear-to-b from-[#F5F3F0] via-[#FCFCFC] to-white py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            انضم لنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">تابعنا على إنستجرام</h2>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-4" />
          <p className="text-black/60 font-bold text-base">
            @velixstore.eg
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-2 md:gap-3 max-w-3xl mx-auto"
        >
          {PHOTOS.map((photo, idx) => (
            <motion.button
              key={photo.id}
              onClick={handleOpenInstagram}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * idx }}
              className="relative aspect-square rounded-xl overflow-hidden bg-linear-to-br from-rose-gold-light/20 via-rose-gold/10 to-copper/20 border border-rose-gold/10 group cursor-pointer"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-rose-gold/60 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <div className="flex items-center gap-1 text-rose-gold/80">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-[10px] md:text-xs font-bold">{photo.likes}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-xs font-bold px-2 py-1 bg-black/60 rounded-full">
                  {photo.label}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleOpenInstagram}
            className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-rose-gold/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            تابعنا @velixstore.eg
          </button>
        </motion.div>
      </div>
    </section>
  );
}

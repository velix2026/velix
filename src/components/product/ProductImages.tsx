// components/product/ProductImages.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumber } from '@/lib/utils';

interface ProductImagesProps {
  images: string[];
  productName: any;
  stock: number;
}

export default function ProductImages({ images, productName, stock }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discount = productName?.discount || 0;

  if (!images.length) return null;

  const nextImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <>
      <div className="relative">
        {/* الصورة الرئيسية - object-contain عشان تظهر كاملة */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl cursor-pointer group flex items-center justify-center"
        >
          <Image
            src={selectedImage}
            alt={productName?.name || 'product'}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onClick={() => setIsModalOpen(true)}
          />
          
          {/* أيقونة التكبير */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
            aria-label="تكبير الصورة"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          
          {/* أزرار التنقل بين الصور */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
                aria-label="الصورة السابقة"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
                aria-label="الصورة التالية"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
              <span className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                نفذت الكمية
              </span>
            </div>
          )}
          
          {/* Badge الخصم */}
          {discount > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-linear-to-r from-red-500 to-red-600 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
                  -{toArabicNumber(discount)}%
                </span>
              </div>
            )}
        </motion.div>

        {/* دوائر التنقل */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(images[idx])}
                className={`transition-all duration-300 rounded-full ${
                  selectedImage === images[idx]
                    ? 'w-8 h-2 bg-black'
                    : 'w-2 h-2 bg-black/30 hover:bg-black/50 hover:scale-110'
                }`}
                aria-label={`انتقال إلى الصورة ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* الصور المصغرة - object-contain برضه */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {images.slice(0, 4).map((img, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-white transition-all duration-300 flex items-center justify-center ${
                  selectedImage === img 
                    ? 'ring-2 ring-black shadow-xl scale-95' 
                    : 'hover:scale-95 hover:shadow-md'
                }`}
              >
                <Image 
                  src={img} 
                  alt={`${productName?.name || 'product'} - صورة ${idx + 1}`} 
                  fill 
                  className="object-contain p-1"
                  sizes="80px"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* معرض الصور المنبثق (Lightbox) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition p-2 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt={productName?.name || 'product'}
                width={1200}
                height={1200}
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
              />
              
              {/* أزرار التنقل في الـ Lightbox */}
              {images.length > 1 && (
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="bg-white/20 hover:bg-white/40 rounded-full p-3 transition backdrop-blur-sm hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="bg-white/20 hover:bg-white/40 rounded-full p-3 transition backdrop-blur-sm hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* دوائر التنقل في الـ Lightbox */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(images[idx]);
                      }}
                      className={`transition-all duration-300 rounded-full ${
                        selectedImage === images[idx]
                          ? 'w-6 h-1.5 bg-white'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80 hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  productName: string;
  stock: number;
}

export default function ProductImages({ images, productName, stock }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div>
      {/* الصورة الرئيسية */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          priority
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              نفذت الكمية
            </span>
          </div>
        )}
      </div>

      {/* الصور المصغرة */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-all hover:scale-105 ${
                selectedImage === img ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${productName} - صورة ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
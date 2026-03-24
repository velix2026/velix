'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(product.mainImage);
  const [imgError, setImgError] = useState(false);
  
  const whatsappMessage = `أنا عايز أطلب ${product.name} - سعر ${product.price} جنيه`;
  const whatsappLink = `https://wa.me/201500125133?text=${encodeURIComponent(whatsappMessage)}`;

  const allImages = [product.mainImage, ...product.subImages];

  // إذا كان هناك خطأ في الصورة، نعرض صورة بديلة
  const imageSrc = imgError ? '/images/placeholder.jpg' : currentImage;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="relative h-80 w-full bg-gray-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
          onError={() => setImgError(true)}
        />
        
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-1 rounded-full">
            {allImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImage(img);
                  setImgError(false);
                }}
                className={`w-2 h-2 rounded-full transition ${
                  currentImage === img ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`الصورة ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-black">{product.price} جنيه</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-black text-white py-2 rounded-full hover:bg-gray-800 transition"
        >
          اطلب الآن
        </a>
      </div>
    </div>
  );
}
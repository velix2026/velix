// src/components/ProductCard.tsx
import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // تحويل السعر من نص إلى رقم للعرض
  const priceNumber = parseFloat(product.price);
  const oldPriceNumber = product.oldPrice ? parseFloat(product.oldPrice) : undefined;
  
  // رسالة واتساب تحتوي على اسم المنتج والسعر
  const whatsappMessage = `أنا عايز أطلب ${product.name} - سعر ${priceNumber} جنيه`;
  const whatsappLink = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMessage)}`;

  // معالجة الصورة: إذا كان المسار يبدأ بـ /images نضيفه كما هو
  const imageSrc = product.image || "/images/placeholder.jpg";

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="relative h-80 w-full">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        {oldPriceNumber && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
            خصم
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.nameEn}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-black">{priceNumber} جنيه</span>
          {oldPriceNumber && (
            <span className="text-gray-400 line-through">{oldPriceNumber} جنيه</span>
          )}
        </div>
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
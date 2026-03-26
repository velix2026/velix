'use client';

import { useState, useEffect } from 'react';

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  // Countdown Timer للخصم
  useEffect(() => {
    if (!product?.offerEndsAt) return;

    const interval = setInterval(() => {
      const diff = new Date(product.offerEndsAt).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [product?.offerEndsAt]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}س : ${minutes}د : ${seconds}ث`;
  };

  const stock = product.stock || 0;

  return (
    <div>
      {/* العنوان */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500">{product.category}</p>
      </div>

      {/* التقييم */}
      {product.rating && product.rating > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.rating})</span>
        </div>
      )}

      {/* Countdown Timer للعرض */}
      {timeLeft > 0 && (
        <div className="bg-red-500 text-white p-3 rounded-lg text-center mb-4">
          <p className="text-sm">⏰ ينتهي العرض خلال:</p>
          <p className="font-bold text-lg">{formatTime(timeLeft)}</p>
        </div>
      )}

      {/* السعر */}
      <div className="mb-6">
        {product.oldPrice ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-black">{product.price} جنيه</span>
            <span className="text-lg text-gray-400 line-through">{product.oldPrice} جنيه</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
              -{product.discount}%
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-black">{product.price} جنيه</span>
        )}
      </div>

      {/* حالة المخزون */}
      <div className="mb-6">
        {stock > 0 ? (
          <p className="text-green-600 text-sm font-medium">
            {stock <= 5 ? `⏳ باقي ${stock} قطع فقط - اطلب بسرعة!` : '✅ متوفر'}
          </p>
        ) : (
          <p className="text-red-500 text-sm font-medium">❌ غير متوفر حالياً</p>
        )}
      </div>

      {/* وصف المنتج */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-lg mb-3">وصف المنتج</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* تفاصيل إضافية */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">القسم:</span>
            <span className="mr-2 font-medium">{product.category}</span>
          </div>
          <div>
            <span className="text-gray-500">رمز المنتج:</span>
            <span className="mr-2 font-medium">VEL-{product.id}</span>
          </div>
          <div>
            <span className="text-gray-500">الحالة:</span>
            <span className={`mr-2 font-medium ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {stock > 0 ? 'متوفر' : 'غير متوفر'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">الشحن:</span>
            <span className="mr-2 font-medium">{product.price > 500 ? 'مجاني' : '25 جنيه'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
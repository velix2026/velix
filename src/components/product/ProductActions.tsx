'use client';

import { useState } from 'react';

interface ProductActionsProps {
  product: any;
  onOrder: (data: { size: string; color: string; quantity: number }) => void;
}

const allColors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
];

export default function ProductActions({ product, onOrder }: ProductActionsProps) {
  const [selection, setSelection] = useState({
    size: product.sizes?.[0] || '',
    color: product.colors?.[0] || '',
    quantity: 1,
  });

  const stock = product.stock || 0;
  const sizes: string[] = product.sizes || [];
  const colors: string[] = product.colors || [];

  const updateSelection = (key: string, value: any) => {
    setSelection(prev => ({ ...prev, [key]: value }));
  };

  const handleOrder = () => {
    if (sizes.length > 0 && !selection.size) {
      alert('الرجاء اختيار المقاس');
      return;
    }
    if (colors.length > 0 && !selection.color) {
      alert('الرجاء اختيار اللون');
      return;
    }
    onOrder(selection);
  };

  // مشاركة المنتج
  const shareProduct = (platform: 'whatsapp' | 'facebook') => {
    const url = window.location.href;
    const text = `شوف منتج ${product.name} من VELIX`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <div>
      {/* المقاسات */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">المقاس:</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => updateSelection('size', size)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selection.size === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* الألوان */}
      {colors.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">اللون:</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((colorCode) => {
              const color = allColors.find(c => c.code === colorCode);
              return (
                <button
                  key={colorCode}
                  onClick={() => updateSelection('color', colorCode)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selection.color === colorCode
                      ? 'ring-2 ring-offset-2 ring-black scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: color?.value || colorCode,
                    border: color?.border ? '1px solid #e5e7eb' : 'none',
                  }}
                  title={color?.name}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* الكمية */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">الكمية:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSelection('quantity', Math.max(1, selection.quantity - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-medium">{selection.quantity}</span>
          <button
            onClick={() => updateSelection('quantity', Math.min(stock, selection.quantity + 1))}
            disabled={selection.quantity >= stock}
            className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
          >
            +
          </button>
          <span className="text-sm text-gray-500 mr-2">متاح: {stock} قطعة</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleOrder}
          disabled={stock === 0}
          className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          اطلب الآن
        </button>
        <button
          onClick={() => {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const exists = favorites.some((p: any) => p.id === product.id);
            if (exists) {
              const newFavorites = favorites.filter((p: any) => p.id !== product.id);
              localStorage.setItem('favorites', JSON.stringify(newFavorites));
            } else {
              favorites.push(product);
              localStorage.setItem('favorites', JSON.stringify(favorites));
            }
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));
          }}
          className="p-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-black transition"
          aria-label="المفضلة"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* أزرار المشاركة */}
      <div className="flex gap-4">
        <button
          onClick={() => shareProduct('whatsapp')}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.897.482 1.849.722 2.982.722h.001c3.18 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.766-5.765-5.766zM15.87 15.619c-.297.736-1.256 1.412-1.922 1.476-.513.05-1.117-.106-1.792-.333-1.147-.386-2.225-1.002-3.094-1.783-.857-.769-1.434-1.677-1.795-2.624-.345-.902-.378-1.667-.091-2.354.268-.644.881-1.135 1.565-1.258.259-.047.516-.03.757.018.248.05.492.166.707.344.219.181.422.424.576.724.08.156.135.333.168.52.021.115.02.236-.009.355-.028.118-.078.233-.138.344-.107.197-.329.523-.473.7-.132.164-.276.338-.381.488-.131.187-.021.387.044.484.255.376.649.77 1.097 1.057.386.249.876.425 1.266.505.214.044.382.006.505-.135.159-.181.329-.385.489-.597.131-.174.287-.221.489-.138.201.082.437.197.75.366.288.155.509.291.668.401.154.107.289.232.379.388.09.156.114.336.071.511-.085.345-.399.792-.664 1.059z"/>
          </svg>
          مشاركة عبر واتساب
        </button>
        <button
          onClick={() => shareProduct('facebook')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          مشاركة عبر فيسبوك
        </button>
      </div>
    </div>
  );
}
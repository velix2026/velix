'use client';

import { useState, useEffect } from 'react';

interface ProductActionsProps {
  product: any;
  onOrder: (data: { size: string; color: string; quantity: number }) => void;
  onAddToCart?: (data: { size: string; color: string; quantity: number }) => void;
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

export default function ProductActions({ product, onOrder, onAddToCart }: ProductActionsProps) {
  const [selection, setSelection] = useState({
    size: product.sizes?.[0] || '',
    color: product.colors?.[0] || '',
    quantity: 1,
  });
  const [isFavorited, setIsFavorited] = useState(false);

  const stock = product.stock || 0;
  const sizes: string[] = product.sizes || [];
  const colors: string[] = product.colors || [];

  // تحميل حالة المفضلة
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.some((p: any) => p.id === product.id));
  }, [product.id]);

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

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selection.size) {
      alert('الرجاء اختيار المقاس');
      return;
    }
    if (colors.length > 0 && !selection.color) {
      alert('الرجاء اختيار اللون');
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.size === selection.size && item.color === selection.color
    );
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += selection.quantity;
    } else {
      cart.push({
        ...product,
        quantity: selection.quantity,
        selectedSize: selection.size,
        selectedColor: selection.color,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    alert('✅ تم إضافة المنتج إلى السلة');
    
    if (onAddToCart) onAddToCart(selection);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      const newFavorites = favorites.filter((p: any) => p.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorited(false);
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorited(true);
    }
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  // مشاركة المنتج
  const shareProduct = async () => {
    const url = window.location.href;
    const title = `VELIX - ${product.name}`;
    const text = `شوف منتج ${product.name} من VELIX`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('تم نسخ رابط المنتج 📋');
    }
  };

  return (
    <>
      {/* أزرار المفضلة والمشاركة - ستظهر في Breadcrumb عبر الـ Portal */}
      <div className="hidden md:flex items-center gap-3" id="product-actions-portal">
        <button
          onClick={toggleFavorite}
          className={`p-2 rounded-full border transition flex items-center justify-center ${
            isFavorited
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-black'
          }`}
          aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <button
          onClick={shareProduct}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition flex items-center justify-center"
          aria-label="مشاركة المنتج"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* باقي محتوى المنتج */}
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

        {/* أزرار الإجراءات الرئيسية */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleOrder}
            disabled={stock === 0}
            className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            اطلب الآن
          </button>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="flex-1 bg-gray-800 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition disabled:opacity-50"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </>
  );
}
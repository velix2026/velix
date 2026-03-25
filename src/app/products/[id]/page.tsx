'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/products';

// الألوان المتاحة
const allColors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
];

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const allProducts = await getProducts();
      const found = allProducts.find(p => p.id === parseInt(params.id as string));
      setProduct(found || null);
      if (found) {
        setSelectedImage(found.mainImage);
        if (found.colors && found.colors.length > 0) {
          setSelectedColor(found.colors[0]);
        }
        if (found.sizes && found.sizes.length > 0) {
          setSelectedSize(found.sizes[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  // التحقق من حالة المفضلة عند التحميل
  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setAddedToWishlist(favorites.some((p: Product) => p.id === product.id));
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('الرجاء اختيار المقاس');
      return;
    }
    if (!selectedColor) {
      alert('الرجاء اختيار اللون');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
      (item: any) => item.id === product?.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
        selectedSize,
        selectedColor,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    
    // تحديث عداد السلة في الهيدر
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart.length }));
  };

  const handleAddToWishlist = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (addedToWishlist) {
      const newFavorites = favorites.filter((p: Product) => p.id !== product?.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setAddedToWishlist(false);
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setAddedToWishlist(true);
    }
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
          <Link href="/products" className="text-black underline">
            العودة إلى المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const stock = product.stock || 0;
  const allImages = [product.mainImage, ...product.subImages];
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-black">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-black">المنتجات</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* قسم الصور */}
          <div>
            {/* الصورة الرئيسية */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
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
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-all ${
                      selectedImage === img ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - صورة ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* معلومات المنتج */}
          <div>
            {/* عنوان المنتج */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500">{product.category}</p>
            </div>

            {/* التقييم */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating!) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.rating})</span>
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

            {/* المقاسات */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">المقاس:</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        selectedSize === size
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
                        onClick={() => setSelectedColor(colorCode)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === colorCode
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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 mr-2">متاح: {stock} قطعة</span>
              </div>
            </div>

            {/* أزرار الإجراء */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addedToCart ? '✓ تم الإضافة' : 'إضافة إلى السلة'}
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`p-3 rounded-full border transition ${
                  addedToWishlist
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
                aria-label="المفضلة"
              >
                <svg className="w-5 h-5" fill={addedToWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* الوصف */}
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
                  <span className="mr-2 font-medium">
                    {product.price > 500 ? 'مجاني' : '25 جنيه'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {addedToCart && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          ✅ تم إضافة المنتج إلى السلة
        </div>
      )}
    </div>
  );
}
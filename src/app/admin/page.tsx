'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) {
      setStatus('❌ الرجاء اختيار صورة رئيسية');
      return;
    }

    setUploading(true);
    setStatus('جاري رفع المنتج والصور...');

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('mainImage', mainImage);
    subImages.forEach(img => formData.append('subImages', img));

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setStatus('✅ تم إضافة المنتج بنجاح!');
        setProduct({ name: '', price: '', category: '', description: '' });
        setMainImage(null);
        setSubImages([]);
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input: any) => (input.value = ''));
      } else {
        setStatus('❌ حدث خطأ أثناء الإضافة');
      }
    } catch {
      setStatus('❌ حدث خطأ في الاتصال');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">لوحة تحكم VELIX</h1>
          <p className="text-gray-600 mt-2">أضف منتج جديد مع الصور</p>
        </div>
        
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (جنيه)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
              <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              >
                <option value="">اختر القسم</option>
                <option value="تيشرتات">تيشرتات</option>
                <option value="هوديز">هوديز</option>
                <option value="جاكيتات">جاكيتات</option>
                <option value="بناطيل">بناطيل</option>
                <option value="اكسسوارات">اكسسوارات</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                rows={4}
                required
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الصورة الرئيسية</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full p-2 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white hover:file:bg-gray-800 transition"
                required
              />
              {mainImage && (
                <p className="text-sm text-green-600 mt-1">✓ {mainImage.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">صور إضافية (اختياري)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
                className="w-full p-2 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white hover:file:bg-gray-800 transition"
              />
              {subImages.length > 0 && (
                <p className="text-sm text-green-600 mt-1">✓ {subImages.length} صور</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}
            </button>
            
            {status && (
              <p className={`text-center text-sm ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {status}
              </p>
            )}
          </div>
        </form>
        
        {/* Logout Button */}
        <div className="flex justify-end max-w-2xl mx-auto mt-4">
          <button
            onClick={() => {
              localStorage.removeItem('adminAuth');
              window.location.href = '/admin/login';
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            تسجيل خروج
          </button>
        </div>
      </div>
    </div>
  );
}
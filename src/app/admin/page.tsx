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
    const auth = sessionStorage.getItem('adminAuth');
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

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-stone-50 to-white flex items-center justify-center">
        <div className="text-stone-400 font-medium">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">VELIX</h1>
            <p className="text-stone-400 mt-1 font-medium">لوحة التحكم</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-stone-400 hover:text-stone-600 transition"
          >
            تسجيل خروج
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">اسم المنتج</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition font-medium"
                required
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">السعر (جنيه)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition font-medium"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">القسم</label>
              <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition font-medium"
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
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">وصف المنتج</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition font-medium"
                rows={4}
                required
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">الصورة الرئيسية</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-white file:font-bold hover:file:bg-stone-700 transition"
                required
              />
              {mainImage && (
                <p className="text-xs text-stone-400 mt-1 font-medium">✓ {mainImage.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">صور إضافية (اختياري)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-white file:font-bold hover:file:bg-stone-700 transition"
              />
              {subImages.length > 0 && (
                <p className="text-xs text-stone-400 mt-1 font-medium">✓ تم اختيار {subImages.length} صور</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition disabled:opacity-50 font-bold tracking-wide"
            >
              {uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}
            </button>
            
            {status && (
              <p className={`text-center text-sm font-medium ${status.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {status}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
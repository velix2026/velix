'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber, formatPrice, formatDiscount } from '@/lib/utils';

// المقاسات المتاحة
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// الألوان المتاحة
const colors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: '',
    description: '',
    stock: '',
    isNew: false,
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const calculateDiscount = () => {
    if (product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price)) {
      const discountPercent = ((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100;
      return Math.round(discountPercent);
    }
    return 0;
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorCode: string) => {
    setSelectedColors(prev =>
      prev.includes(colorCode) ? prev.filter(c => c !== colorCode) : [...prev, colorCode]
    );
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
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
    if (selectedSizes.length === 0) {
      setStatus('❌ الرجاء اختيار مقاس واحد على الأقل');
      return;
    }
    if (selectedColors.length === 0) {
      setStatus('❌ الرجاء اختيار لون واحد على الأقل');
      return;
    }

    setUploading(true);
    setStatus('جاري رفع المنتج والصور...');

    const discount = calculateDiscount();
    const finalPrice = product.price;
    const finalOldPrice = product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) ? product.oldPrice : undefined;

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', finalPrice);
    formData.append('oldPrice', finalOldPrice || '');
    formData.append('discount', discount.toString());
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('stock', product.stock);
    formData.append('isNew', product.isNew.toString());
    formData.append('sizes', JSON.stringify(selectedSizes));
    formData.append('colors', JSON.stringify(selectedColors));
    formData.append('mainImage', mainImage);
    formData.append('createdAt', new Date().toISOString());
    subImages.forEach(img => formData.append('subImages', img));

    try {
      const res = await fetch('/api/products', { method: 'POST', body: formData });
      if (res.ok) {
        setStatus('✅ تم إضافة المنتج بنجاح!');
        setProduct({ name: '', price: '', oldPrice: '', category: '', description: '', stock: '', isNew: false });
        setSelectedSizes([]);
        setSelectedColors([]);
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

  const discount = calculateDiscount();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black font-bold">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center sm:text-right">
            <h1 className="text-3xl font-black text-black">VELIX</h1>
            <p className="text-black/50 text-sm font-bold mt-1">لوحة التحكم</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/admin/products" className="px-5 py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>
              إدارة المنتجات
            </Link>
            <Link href="/admin/orders" className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              إدارة الطلبات
            </Link>
            <Link href="/admin/newsletter" className="px-5 py-2 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 hover:from-emerald-600 hover:via-green-600 hover:to-lime-500 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              المشتركين
            </Link>
            <button onClick={handleLogout} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              تسجيل خروج
            </button>
          </div>
        </div>

        {/* كاردز سريعة للوصول */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/products" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-black/10 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">📦</div>
            <h3 className="font-black text-black text-lg">المنتجات</h3>
            <p className="text-black/50 text-sm font-bold mt-1">إدارة وعرض وتعديل المنتجات</p>
          </Link>

          <Link href="/admin/orders" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-black/10 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">🛒</div>
            <h3 className="font-black text-black text-lg">الطلبات</h3>
            <p className="text-black/50 text-sm font-bold mt-1">متابعة وتحديث حالة الطلبات</p>
          </Link>

          <Link href="/admin/newsletter" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-black/10 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">📧</div>
            <h3 className="font-black text-black text-lg">المشتركين</h3>
            <p className="text-black/50 text-sm font-bold mt-1">إدارة النشرة البريدية وإرسال العروض</p>
          </Link>
        </div>

        {/* نموذج إضافة منتج */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
            <span className="text-xl">➕</span>
            إضافة منتج جديد
          </h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden">
            <div className="p-6 space-y-5">
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">اسم المنتج</label><input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required dir="rtl" /></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">السعر (جنيه)</label><input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required /></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">السعر القديم (للخصم - اختياري)</label><input type="number" value={product.oldPrice} onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" placeholder="اتركه فارغ إذا لا يوجد خصم" />
              {discount > 0 && <p className="text-xs text-green-600 mt-1 font-bold">✓ نسبة الخصم: {toArabicNumber(discount)}%</p>}</div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">عدد القطع المتاحة</label><input type="number" min="0" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required /></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="isNew" checked={product.isNew} onChange={(e) => setProduct({ ...product, isNew: e.target.checked })} className="w-4 h-4 accent-black" /><label htmlFor="isNew" className="text-sm font-bold text-black">منتج جديد</label></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">القسم</label><select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required><option value="">اختر القسم</option><option value="تيشرتات">تيشرتات</option><option value="هوديز">هوديز</option><option value="شروال">شروال</option></select></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-2">المقاسات المتاحة</label><div className="flex flex-wrap gap-2">{sizes.map(size => <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedSizes.includes(size) ? 'bg-black text-white shadow-md scale-105' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>{size}</button>)}</div></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-2">الألوان المتاحة</label><div className="flex flex-wrap gap-3">{colors.map(color => <button type="button" key={color.code} onClick={() => handleColorToggle(color.code)} className={`w-10 h-10 rounded-full transition-all duration-300 ${selectedColors.includes(color.code) ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-lg' : 'hover:scale-105'}`} style={{ backgroundColor: color.value, border: color.border ? '1px solid #e5e7eb' : 'none' }} title={color.name} />)}</div></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">وصف المنتج</label><textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={4} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required dir="rtl" /></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">الصورة الرئيسية</label><input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full p-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-black font-bold" required /></div>
              <div><label className="block text-xs font-black text-black uppercase tracking-wider mb-1">صور إضافية (اختياري)</label><input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="w-full p-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-black font-bold" /></div>
              <button type="submit" disabled={uploading} className="w-full bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 font-black tracking-wide shadow-md hover:shadow-lg">{uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}</button>
              {status && <p className={`text-center text-sm font-bold ${status.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
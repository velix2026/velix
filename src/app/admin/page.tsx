// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface AnalyticsData {
  totalOrders: number;
  totalSales: number;
  totalCustomers: number;
  totalReviews: number;
  averageRating: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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

  // جلب الإحصائيات
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (!data.error) {
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

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
      <div className="min-h-screen bg-linear-to-br from-stone-50 to-white flex items-center justify-center">
        <div className="text-stone-400 font-medium">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center sm:text-right">
            <h1 className="text-3xl font-bold text-stone-800">VELIX</h1>
            <p className="text-stone-400 mt-1 font-medium">لوحة التحكم</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/admin/products" className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>
              إدارة المنتجات
            </Link>
            <Link href="/admin/orders" className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              إدارة الطلبات
            </Link>
            <button onClick={handleLogout} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              تسجيل خروج
            </button>
          </div>
        </div>

        {/* ✅ قسم الإحصائيات - يظهر بس لو في بيانات */}
        {analytics && (analytics.totalOrders > 0 || analytics.totalSales > 0) && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span>
              الإحصائيات
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-100">
                <div className="text-2xl font-black text-stone-800">{analytics.totalOrders.toLocaleString()}</div>
                <div className="text-stone-400 text-sm font-medium mt-1">إجمالي الطلبات</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-100">
                <div className="text-2xl font-black text-stone-800">{analytics.totalCustomers.toLocaleString()}</div>
                <div className="text-stone-400 text-sm font-medium mt-1">إجمالي العملاء</div>
              </div>
              {analytics.averageRating > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-100">
                  <div className="text-2xl font-black text-stone-800 flex items-center gap-1">
                    {analytics.averageRating}
                    <span className="text-yellow-500 text-xl">★</span>
                  </div>
                  <div className="text-stone-400 text-sm font-medium mt-1">متوسط التقييم</div>
                </div>
              )}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-100">
                <div className="text-2xl font-black text-stone-800">{Math.floor(analytics.totalSales).toLocaleString()}</div>
                <div className="text-stone-400 text-sm font-medium mt-1">إجمالي المبيعات (جنيه)</div>
              </div>
            </div>
          </div>
        )}

        {/* نموذج إضافة منتج */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
          <div className="p-6 space-y-5">
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">اسم المنتج</label><input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full p-3 bg-stone-50 border rounded-xl" required dir="rtl" /></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">السعر (جنيه)</label><input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full p-3 bg-stone-50 border rounded-xl" required /></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">السعر القديم (للخصم - اختياري)</label><input type="number" value={product.oldPrice} onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })} className="w-full p-3 bg-stone-50 border rounded-xl" placeholder="اتركه فارغ إذا لا يوجد خصم" />
            {discount > 0 && <p className="text-xs text-green-600 mt-1 font-medium">✓ نسبة الخصم: {discount}%</p>}</div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">عدد القطع المتاحة</label><input type="number" min="0" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} className="w-full p-3 bg-stone-50 border rounded-xl" required /></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="isNew" checked={product.isNew} onChange={(e) => setProduct({ ...product, isNew: e.target.checked })} /><label htmlFor="isNew" className="text-sm font-medium text-stone-700">منتج جديد</label></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">القسم</label><select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} className="w-full p-3 bg-stone-50 border rounded-xl" required><option value="">اختر القسم</option><option value="تيشرتات">تيشرتات</option><option value="هوديز">هوديز</option><option value="شروال">شروال</option></select></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">المقاسات المتاحة</label><div className="flex flex-wrap gap-2">{sizes.map(size => <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSizes.includes(size) ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>{size}</button>)}</div></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">الألوان المتاحة</label><div className="flex flex-wrap gap-3">{colors.map(color => <button type="button" key={color.code} onClick={() => handleColorToggle(color.code)} className={`w-10 h-10 rounded-full transition ${selectedColors.includes(color.code) ? 'ring-2 ring-offset-2 ring-stone-800 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.value, border: color.border ? '1px solid #e5e7eb' : 'none' }} title={color.name} />)}</div></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">وصف المنتج</label><textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={4} className="w-full p-3 bg-stone-50 border rounded-xl" required dir="rtl" /></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">الصورة الرئيسية</label><input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full p-2 bg-stone-50 border rounded-xl" required /></div>
            <div><label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">صور إضافية (اختياري)</label><input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="w-full p-2 bg-stone-50 border rounded-xl" /></div>
            <button type="submit" disabled={uploading} className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition disabled:opacity-50 font-bold tracking-wide">{uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}</button>
            {status && <p className={`text-center text-sm font-medium ${status.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
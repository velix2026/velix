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

// ✅ حالة خصم الكمية المتدرج
interface QuantityTier {
  minQuantity: number;
  discountPerItem: number;
}

interface QuantityDiscount {
  enabled: boolean;
  tiers: QuantityTier[];
}

// ✅ واجهة الكمية لكل لون ومقاس
interface StockItem {
  colorCode: string;
  size: string;
  quantity: number;
}

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
    isNew: false,
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [quantityDiscount, setQuantityDiscount] = useState<QuantityDiscount>({
    enabled: false,
    tiers: [
      { minQuantity: 2, discountPerItem: 0 },
      { minQuantity: 3, discountPerItem: 0 },
      { minQuantity: 4, discountPerItem: 0 },
      { minQuantity: 5, discountPerItem: 0 }
    ],
  });

  // ✅ دالة حساب الخصم المئوي من السعر القديم
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

  const updateStockQuantity = (colorCode: string, size: string, quantity: number) => {
    setStockItems(prev => {
      const existing = prev.find(item => item.colorCode === colorCode && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.colorCode === colorCode && item.size === size
            ? { ...item, quantity }
            : item
        );
      } else {
        return [...prev, { colorCode, size, quantity }];
      }
    });
  };

  const getStockQuantity = (colorCode: string, size: string) => {
    const item = stockItems.find(i => i.colorCode === colorCode && i.size === size);
    return item?.quantity || 0;
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

  const updateTier = (index: number, field: keyof QuantityTier, value: number) => {
    const newTiers = [...quantityDiscount.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setQuantityDiscount({ ...quantityDiscount, tiers: newTiers });
  };

  const addTier = () => {
    const lastTier = quantityDiscount.tiers[quantityDiscount.tiers.length - 1];
    const newMinQuantity = (lastTier?.minQuantity || 5) + 1;
    setQuantityDiscount({
      ...quantityDiscount,
      tiers: [...quantityDiscount.tiers, { minQuantity: newMinQuantity, discountPerItem: 0 }]
    });
  };

  const removeTier = (index: number) => {
    if (quantityDiscount.tiers.length > 1) {
      const newTiers = quantityDiscount.tiers.filter((_, i) => i !== index);
      setQuantityDiscount({ ...quantityDiscount, tiers: newTiers });
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
    formData.append('isNew', product.isNew.toString());
    formData.append('sizes', JSON.stringify(selectedSizes));
    formData.append('colors', JSON.stringify(selectedColors));
    formData.append('stockItems', JSON.stringify(stockItems));
    formData.append('mainImage', mainImage);
    formData.append('createdAt', new Date().toISOString());
    formData.append('quantityDiscount', JSON.stringify(quantityDiscount));
    subImages.forEach(img => formData.append('subImages', img));

    try {
      const res = await fetch('/api/products', { method: 'POST', body: formData });
      if (res.ok) {
        setStatus('✅ تم إضافة المنتج بنجاح!');
        setProduct({ name: '', price: '', oldPrice: '', category: '', description: '', isNew: false });
        setSelectedSizes([]);
        setSelectedColors([]);
        setStockItems([]);
        setMainImage(null);
        setSubImages([]);
        setQuantityDiscount({
          enabled: false,
          tiers: [
            { minQuantity: 2, discountPerItem: 0 },
            { minQuantity: 3, discountPerItem: 0 },
            { minQuantity: 4, discountPerItem: 0 },
            { minQuantity: 5, discountPerItem: 0 }
          ]
        });
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header - مبسط مع زر رجوع للداش بورد */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-black">إضافة منتج جديد</h1>
            <p className="text-black/50 text-sm font-bold mt-1">أضف منتجاً جديداً إلى متجرك</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-sm font-bold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            رجوع للداش بورد
          </Link>
        </div>

        {/* نموذج إضافة منتج */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden">
          <div className="p-6 space-y-5">
            {/* اسم المنتج */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">اسم المنتج</label>
              <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required dir="rtl" />
            </div>
            
            {/* السعر */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">السعر (جنيه)</label>
              <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required />
            </div>
            
            {/* السعر القديم (للخصم المئوي) */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">السعر القديم (للخصم المئوي - اختياري)</label>
              <input type="number" value={product.oldPrice} onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" placeholder="اتركه فارغ إذا لا يوجد خصم مئوي" />
              {discount > 0 && <p className="text-xs text-green-600 mt-1 font-bold">✓ نسبة الخصم المئوي: {toArabicNumber(discount)}%</p>}
            </div>
            
            {/* منتج جديد */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isNew" checked={product.isNew} onChange={(e) => setProduct({ ...product, isNew: e.target.checked })} className="w-4 h-4 accent-black" />
              <label htmlFor="isNew" className="text-sm font-bold text-black">منتج جديد</label>
            </div>
            
            {/* القسم */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">القسم</label>
              <select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required>
                <option value="">اختر القسم</option>
                <option value="تيشرتات">تيشرتات</option>
                <option value="هوديز">هوديز</option>
                <option value="شروال">شروال</option>
              </select>
            </div>
            
            {/* المقاسات */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">المقاسات المتاحة</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedSizes.includes(size) ? 'bg-black text-white shadow-md scale-105' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* الألوان */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">الألوان المتاحة</label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button type="button" key={color.code} onClick={() => handleColorToggle(color.code)} className={`w-10 h-10 rounded-full transition-all duration-300 ${selectedColors.includes(color.code) ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-lg' : 'hover:scale-105'}`} style={{ backgroundColor: color.value, border: color.border ? '1px solid #e5e7eb' : 'none' }} title={color.name} />
                ))}
              </div>
            </div>
            
            {/* جدول الكميات لكل لون ومقاس */}
            {selectedColors.length > 0 && selectedSizes.length > 0 && (
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">الكميات المتاحة (لكل لون ومقاس)</label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-2 text-right text-sm font-black text-black">اللون / المقاس</th>
                        {selectedSizes.map(size => (
                          <th key={size} className="border border-gray-200 p-2 text-center text-sm font-black text-black">{size}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedColors.map(colorCode => {
                        const colorName = colors.find(c => c.code === colorCode)?.name || colorCode;
                        const colorValue = colors.find(c => c.code === colorCode)?.value;
                        return (
                          <tr key={colorCode}>
                            <td className="border border-gray-200 p-2 text-sm font-bold text-black">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorValue, border: colorCode === 'white' ? '1px solid #e5e7eb' : 'none' }}></div>
                                {colorName}
                              </div>
                            </td>
                            {selectedSizes.map(size => (
                              <td key={size} className="border border-gray-200 p-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={getStockQuantity(colorCode, size)}
                                  onChange={(e) => updateStockQuantity(colorCode, size, parseInt(e.target.value) || 0)}
                                  className="w-full p-2 text-center bg-white border-2 border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-bold">💡 أدخل الكمية المتاحة لكل لون ومقاس (0 يعني غير متاح)</p>
              </div>
            )}
            
            {/* الوصف */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">وصف المنتج</label>
              <textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={4} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black font-bold" required dir="rtl" />
            </div>
            
            {/* خصم الكمية المتدرج */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={quantityDiscount.enabled}
                  onChange={(e) => setQuantityDiscount({ ...quantityDiscount, enabled: e.target.checked })}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-black text-black">🎁 تفعيل خصم الكمية (إضافي)</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">ملاحظة: هذا الخصم يضاف فوق الخصم المئوي (إن وجد)</p>
              
              {quantityDiscount.enabled && (
                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-600">الخصم حسب الكمية (يطبق على الكمية المحددة وكل ما هو أكبر منها):</p>
                  {quantityDiscount.tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <div className="flex-1">
                        <label className="block text-xs font-black text-black mb-1">من {toArabicNumber(tier.minQuantity)} قطعة فأكثر</label>
                        <input
                          type="number"
                          min={idx === 0 ? 2 : (quantityDiscount.tiers[idx-1]?.minQuantity + 1 || 2)}
                          value={tier.minQuantity}
                          onChange={(e) => updateTier(idx, 'minQuantity', parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-white border-2 border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-black text-black mb-1">خصم لكل قطعة (جنيه)</label>
                        <input
                          type="number"
                          min="0"
                          value={tier.discountPerItem}
                          onChange={(e) => updateTier(idx, 'discountPerItem', parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-white border-2 border-gray-200 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      {quantityDiscount.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(idx)}
                          className="mt-5 text-red-500 hover:text-red-600"
                          title="حذف المستوى"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTier}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition"
                  >
                    + إضافة مستوى خصم جديد
                  </button>
                </div>
              )}
            </div>
            
            {/* الصور */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">الصورة الرئيسية</label>
              <input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full p-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-black font-bold" required />
            </div>
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">صور إضافية (اختياري)</label>
              <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="w-full p-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-black font-bold" />
            </div>
            
            {/* زر الإضافة */}
            <button type="submit" disabled={uploading} className="w-full bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 font-black tracking-wide shadow-md hover:shadow-lg">
              {uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}
            </button>
            {status && <p className={`text-center text-sm font-bold ${status.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
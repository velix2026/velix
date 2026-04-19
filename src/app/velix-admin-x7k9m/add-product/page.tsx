'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';
import { clothingColors, getColorByCode } from '@/lib/colors';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

// ✅ مقاسات الملابس
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// ✅ مقاسات الأحذية (من 38 إلى 45)
const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

interface QuantityTier {
  minQuantity: number;
  discountPerItem: number;
}

interface QuantityDiscount {
  enabled: boolean;
  tiers: QuantityTier[];
}

interface StockItem {
  colorCode: string;
  size: string;
  quantity: number;
}

export default function AddProductPage() {
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

  const calculateDiscount = () => {
    if (product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price)) {
      const discountPercent = ((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100;
      return Math.round(discountPercent);
    }
    return 0;
  };

  // ✅ تحديد المقاسات حسب القسم المختار
  const getAvailableSizes = () => {
    if (product.category === 'شوزات') {
      return shoeSizes;
    }
    return clothingSizes;
  };

  // ✅ عند تغيير القسم، إعادة تعيين المقاسات المختارة
  useEffect(() => {
    setSelectedSizes([]);
  }, [product.category]);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    let isValid = false;
    if (auth === 'true' && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed < 60 * 60 * 1000) {
        isValid = true;
      } else {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminLoginTime');
      }
    }
    
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
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

  const getColorName = (colorCode: string) => {
    const color = getColorByCode(colorCode);
    return color.name || colorCode;
  };

  const getColorValue = (colorCode: string) => {
    const color = clothingColors.find(c => c.code === colorCode);
    return color?.code || colorCode;
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
      setStatus('❌ اختار صورة رئيسية');
      return;
    }
    if (selectedSizes.length === 0) {
      setStatus('❌ اختار مقاس واحد على الأقل');
      return;
    }
    if (selectedColors.length === 0) {
      setStatus('❌ اختار لون واحد على الأقل');
      return;
    }

    setUploading(true);
    setStatus('جاري رفع المنتج...');

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
        setStatus('✅ تم إضافة المنتج!');
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
        const error = await res.text();
        console.error('API Error:', error);
        setStatus('❌ فشل إضافة المنتج');
      }
    } catch {
      setStatus('❌ مشكلة في الاتصال');
    } finally {
      setUploading(false);
    }
  };

  const discount = calculateDiscount();
  const availableSizes = getAvailableSizes();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-black">إضافة منتج جديد</h1>
            <p className="text-rose-gold/60 text-sm font-bold mt-1">أضف منتج جديد للمتجر</p>
          </div>
          <Link
            href={`/${ADMIN_SECRET_PATH}`}
            className="flex items-center gap-2 px-4 py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-sm font-bold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            رجوع للداشبورد
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-rose-gold/20 overflow-hidden">
          <div className="p-6 space-y-5">
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">اسم المنتج</label>
              <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all text-black font-bold" required dir="rtl" />
            </div>
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">السعر (جنيه)</label>
              <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all text-black font-bold" required />
            </div>
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">السعر القديم (للخصم - اختياري)</label>
              <input type="number" value={product.oldPrice} onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all text-black font-bold" placeholder="اتركه فارغ لو مفيش خصم" />
              {discount > 0 && <p className="text-xs text-rose-gold mt-1 font-bold">✓ الخصم: {toArabicNumber(discount)}%</p>}
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isNew" checked={product.isNew} onChange={(e) => setProduct({ ...product, isNew: e.target.checked })} className="w-4 h-4 accent-rose-gold" />
              <label htmlFor="isNew" className="text-sm font-bold text-black">منتج جديد</label>
            </div>
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">القسم</label>
              <select 
                value={product.category} 
                onChange={(e) => setProduct({ ...product, category: e.target.value })} 
                className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all text-black font-bold" 
                required
              >
                <option value="">اختر القسم</option>
                <option value="تيشرتات">👕 تيشرتات</option>
                <option value="هوديز">🧥 هوديز</option>
                <option value="شروال">👖 شروال</option>
                <option value="جينز">👖 جينز</option>
                <option value="جواكت">🧥 جواكت</option>
                <option value="شوزات">👟 شوزات</option>
                <option value="اكسسوارات">✨ أكسسوارات VELIX</option>
              </select>
            </div>
                        
            {/* ✅ المقاسات حسب القسم المختار */}
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-2">
                {product.category === 'شوزات' ? 'مقاسات الحذاء' : 'المقاسات المتاحة'}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1 ${
                        isSelected 
                          ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white shadow-md scale-105' 
                          : 'bg-rose-gold/10 text-black hover:bg-rose-gold/20'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSizes.length > 0 && (
                <p className="text-xs text-rose-gold mt-2 font-bold">✓ تم اختيار {toArabicNumber(selectedSizes.length)} مقاس</p>
              )}
            </div>
            
            {/* ✅ الألوان مع علامة اختيار واضحة */}
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-2">الألوان المتاحة</label>
              <div className="flex flex-wrap gap-3">
                {clothingColors.map(color => {
                  const isSelected = selectedColors.includes(color.code);
                  const isLightColor = color.code === '#FFFFFF' || color.code === '#F5F5DC' || color.code === '#FFF8DC' || color.code === '#FAEBD7';
                  return (
                    <button
                      type="button"
                      key={color.code}
                      onClick={() => handleColorToggle(color.code)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isSelected ? 'ring-2 ring-offset-2 ring-rose-gold scale-110 shadow-lg' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.code, border: color.code === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
                      title={color.name}
                    >
                      {isSelected && (
                        <svg className={`w-5 h-5 ${isLightColor ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedColors.length > 0 && (
                <p className="text-xs text-rose-gold mt-2 font-bold">✓ تم اختيار {toArabicNumber(selectedColors.length)} لون</p>
              )}
            </div>
            
            {/* جدول الكميات - مع تحسين إدخال الأرقام للموبايل */}
            {selectedColors.length > 0 && selectedSizes.length > 0 && (
              <div>
                <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-2">الكميات المتاحة</label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-rose-gold/10">
                        <th className="border border-rose-gold/20 p-2 text-right text-sm font-black text-black">اللون / المقاس</th>
                        {selectedSizes.map(size => (
                          <th key={size} className="border border-rose-gold/20 p-2 text-center text-sm font-black text-black">{size}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedColors.map(colorCode => {
                        const colorName = getColorName(colorCode);
                        const colorValue = getColorValue(colorCode);
                        return (
                          <tr key={colorCode}>
                            <td className="border border-rose-gold/20 p-2 text-sm font-bold text-black">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorValue, border: colorCode === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }} />
                                {colorName}
                              </div>
                            </td>
                            {selectedSizes.map(size => {
                              const currentValue = getStockQuantity(colorCode, size);
                              return (
                                <td key={size} className="border border-rose-gold/20 p-2">
                                  <input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        min="0"
                                        value={currentValue === 0 ? '' : currentValue}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          updateStockQuantity(colorCode, size, val === '' ? 0 : parseInt(val) || 0);
                                        }}
                                        className="w-full p-2 text-center bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="0"
                                      />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-rose-gold/60 mt-2 font-bold">💡 أدخل الكمية لكل لون ومقاس (0 يعني مش متاح)</p>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">وصف المنتج</label>
              <textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={4} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent transition-all text-black font-bold" required dir="rtl" />
            </div>
            
            {/* خصم الكمية */}
            <div className="border-t border-rose-gold/20 pt-4 mt-2">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={quantityDiscount.enabled}
                  onChange={(e) => setQuantityDiscount({ ...quantityDiscount, enabled: e.target.checked })}
                  className="w-4 h-4 accent-rose-gold"
                />
                <span className="text-sm font-black text-black">🎁 تفعيل خصم الكمية</span>
              </label>
              <p className="text-xs text-rose-gold/60 mb-3">الخصم ده يضاف فوق الخصم المئوي (لو موجود)</p>
              
              {quantityDiscount.enabled && (
                <div className="space-y-3">
                  <p className="text-xs font-black text-rose-gold/80">الخصم حسب الكمية:</p>
                  {quantityDiscount.tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-rose-gold/5 p-3 rounded-xl border border-rose-gold/20">
                      <div className="flex-1">
                        <label className="block text-xs font-black text-black mb-1">من {toArabicNumber(tier.minQuantity)} قطعة فأكثر</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={idx === 0 ? 2 : (quantityDiscount.tiers[idx-1]?.minQuantity + 1 || 2)}
                          value={tier.minQuantity}
                          onChange={(e) => updateTier(idx, 'minQuantity', parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-black text-black mb-1">خصم لكل قطعة (جنيه)</label>
                        <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              value={tier.discountPerItem === 0 ? '' : tier.discountPerItem}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateTier(idx, 'discountPerItem', val === '' ? 0 : parseInt(val) || 0);
                              }}
                              className="w-full p-2 bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                              placeholder="0"
                            />
                      </div>
                      {quantityDiscount.tiers.length > 1 && (
                        <button type="button" onClick={() => removeTier(idx)} className="mt-5 text-red-500 hover:text-red-600">
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
                    className="w-full py-2 border-2 border-dashed border-rose-gold/30 rounded-xl text-sm font-bold text-rose-gold hover:border-rose-gold/50 hover:text-copper transition"
                  >
                    + إضافة مستوى خصم جديد
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">الصورة الرئيسية</label>
              <input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full p-2 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl text-black font-bold" required />
            </div>
            
            <div>
              <label className="block text-xs font-black text-rose-gold uppercase tracking-wider mb-1">صور إضافية (اختياري)</label>
              <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="w-full p-2 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl text-black font-bold" />
            </div>
            
            <button type="submit" disabled={uploading} className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 font-black tracking-wide shadow-md hover:shadow-rose-gold/30">
              {uploading ? 'جاري الرفع...' : '+ إضافة المنتج'}
            </button>
            
            {status && <p className={`text-center text-sm font-bold ${status.includes('✅') ? 'text-rose-gold' : 'text-red-500'}`}>{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
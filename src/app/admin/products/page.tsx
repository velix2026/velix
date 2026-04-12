// app/admin/products/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/products';
import { toArabicNumber, formatPrice, formatDiscount } from '@/lib/utils';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';

// المقاسات المتاحة
const allSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// الألوان المتاحة
const allColors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
  { name: 'كحلي', value: '#0F172A', code: 'navy' },
  { name: 'بني', value: '#8B4513', code: 'brown' },
  { name: 'ذهبي', value: '#FFD700', code: 'gold' },
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

// ✅ القيم الافتراضية للـ tiers
const DEFAULT_TIERS: QuantityTier[] = [
  { minQuantity: 2, discountPerItem: 0 },
  { minQuantity: 3, discountPerItem: 0 },
  { minQuantity: 4, discountPerItem: 0 },
  { minQuantity: 5, discountPerItem: 0 }
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newSubImages, setNewSubImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [quantityDiscount, setQuantityDiscount] = useState<QuantityDiscount>({
    enabled: false,
    tiers: [...DEFAULT_TIERS],
  });
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('✅ تم حذف المنتج بنجاح');
      } else {
        alert('❌ حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('❌ حدث خطأ في الاتصال');
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ دوال إدارة خصم الكمية المتدرج
  const updateTier = (index: number, field: keyof QuantityTier, value: number) => {
    const newTiers = [...(quantityDiscount.tiers || DEFAULT_TIERS)];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setQuantityDiscount({ ...quantityDiscount, tiers: newTiers });
  };

  const addTier = () => {
    const currentTiers = quantityDiscount.tiers || DEFAULT_TIERS;
    const lastTier = currentTiers[currentTiers.length - 1];
    const newMinQuantity = (lastTier?.minQuantity || 5) + 1;
    setQuantityDiscount({
      ...quantityDiscount,
      tiers: [...currentTiers, { minQuantity: newMinQuantity, discountPerItem: 0 }]
    });
  };

  const removeTier = (index: number) => {
    const currentTiers = quantityDiscount.tiers || DEFAULT_TIERS;
    if (currentTiers.length > 1) {
      const newTiers = currentTiers.filter((_, i) => i !== index);
      setQuantityDiscount({ ...quantityDiscount, tiers: newTiers });
    }
  };

  // ✅ دوال إدارة الكميات لكل لون ومقاس
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

  // ✅ حساب الخصم المئوي من السعر القديم والسعر الحالي
  const calculateDiscountPercent = useCallback(() => {
    if (!editingProduct) return 0;
    if (editingProduct.oldPrice && editingProduct.oldPrice > editingProduct.price) {
      return Math.round(((editingProduct.oldPrice - editingProduct.price) / editingProduct.oldPrice) * 100);
    }
    return 0;
  }, [editingProduct]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setSaving(true);
    
    // حساب الخصم المئوي تلقائياً
    const discountPercent = calculateDiscountPercent();
    
    // ✅ تأكد من صحة البيانات
    const price = parseFloat(editingProduct.price.toString());
    const oldPriceValue = editingProduct.oldPrice ? parseFloat(editingProduct.oldPrice.toString()) : null;
    
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('price', price.toString());
    formData.append('oldPrice', oldPriceValue !== null ? oldPriceValue.toString() : '');
    formData.append('discount', discountPercent.toString());
    formData.append('category', editingProduct.category);
    formData.append('description', editingProduct.description);
    formData.append('isNew', (editingProduct.isNew ?? false).toString());
    formData.append('sizes', JSON.stringify(editingProduct.sizes || []));
    formData.append('colors', JSON.stringify(editingProduct.colors || []));
    formData.append('removedImages', JSON.stringify(removedImages));
    formData.append('stockItems', JSON.stringify(stockItems));
    formData.append('quantityDiscount', JSON.stringify({
      enabled: quantityDiscount.enabled,
      tiers: quantityDiscount.tiers.filter(t => t.discountPerItem > 0 || t.minQuantity > 0)
    }));
    
    if (newMainImage) {
      formData.append('newMainImage', newMainImage);
    }
    newSubImages.forEach(img => formData.append('newSubImages', img));
    
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
        body: formData,
      });
      
      if (res.ok) {
        await loadProducts();
        setEditingProduct(null);
        setNewMainImage(null);
        setNewSubImages([]);
        setRemovedImages([]);
        setStockItems([]);
        setQuantityDiscount({
          enabled: false,
          tiers: [...DEFAULT_TIERS]
        });
        alert('✅ تم تحديث المنتج بنجاح');
      } else {
        const error = await res.text();
        alert(`❌ حدث خطأ أثناء التحديث: ${error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (size: string) => {
    if (!editingProduct) return;
    const currentSizes = editingProduct.sizes || [];
    if (currentSizes.includes(size)) {
      setEditingProduct({ ...editingProduct, sizes: currentSizes.filter(s => s !== size) });
    } else {
      setEditingProduct({ ...editingProduct, sizes: [...currentSizes, size] });
    }
  };

  const toggleColor = (colorCode: string) => {
    if (!editingProduct) return;
    const currentColors = editingProduct.colors || [];
    if (currentColors.includes(colorCode)) {
      setEditingProduct({ ...editingProduct, colors: currentColors.filter(c => c !== colorCode) });
    } else {
      setEditingProduct({ ...editingProduct, colors: [...currentColors, colorCode] });
    }
  };

  const removeImage = (imageUrl: string, isMain: boolean) => {
    if (!editingProduct) return;
    if (isMain) {
      setEditingProduct({ ...editingProduct, mainImage: '' });
    } else {
      setEditingProduct({
        ...editingProduct,
        subImages: editingProduct.subImages.filter(img => img !== imageUrl)
      });
    }
    setRemovedImages(prev => [...prev, imageUrl]);
  };

  const getProductSizes = (product: Product): string[] => {
    return product.sizes || [];
  };

  const getProductColors = (product: Product): string[] => {
    return product.colors || [];
  };

  // ✅ حساب إجمالي الكمية من الـ stockItems
  const getTotalStock = (stockItemsArray: StockItem[]): number => {
    return stockItemsArray.reduce((sum, item) => sum + item.quantity, 0);
  };

  // عند فتح منتج للتعديل، تحميل خصم الكمية والكميات لكل لون ومقاس
  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    
    // تحميل خصم الكمية
    if (product.quantityDiscount && product.quantityDiscount.tiers) {
      setQuantityDiscount({
        enabled: product.quantityDiscount.enabled || false,
        tiers: product.quantityDiscount.tiers.length ? [...product.quantityDiscount.tiers] : [...DEFAULT_TIERS]
      });
    } else {
      setQuantityDiscount({
        enabled: false,
        tiers: [...DEFAULT_TIERS]
      });
    }
    
    // تحميل الكميات لكل لون ومقاس
    if (product.stockItems && Array.isArray(product.stockItems)) {
      setStockItems([...product.stockItems]);
    } else {
      setStockItems([]);
    }
    
    setNewMainImage(null);
    setNewSubImages([]);
    setRemovedImages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="text-black font-bold mr-3">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">إدارة المنتجات</h1>
            <p className="text-black/60 text-sm font-bold mt-1">تعديل وحذف المنتجات</p>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white rounded-full text-sm font-bold hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة منتج جديد
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const sizes = getProductSizes(product);
            const colors = getProductColors(product);
            const totalStock = product.stockItems ? getTotalStock(product.stockItems) : (product.stock || 0);
            const discountPercent = product.oldPrice && product.oldPrice > product.price 
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
              : 0;
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-black/20">
                <div className="relative h-48 w-full bg-gray-50">
                  <Image src={product.mainImage} alt={product.name} fill className="object-contain p-2" />
                  {totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">نفذت الكمية</span>
                    </div>
                  )}
                  {totalStock < 5 && totalStock > 0 && (
                    <div className="absolute top-2 right-2 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ⚡ باقي {toArabicNumber(totalStock)} فقط
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-black text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-black/60 text-sm font-bold">{product.category}</p>
                    </div>
                    {product.isNew && <span className="bg-linear-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">🎉 جديد</span>}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-black text-black">{formatPrice(product.price)}</span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-sm text-black/40 line-through font-bold">{formatPrice(product.oldPrice)}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">{formatDiscount(discountPercent)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {sizes.map((size) => <span key={size} className="text-xs bg-black/10 text-black font-bold px-2 py-1 rounded">{size}</span>)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {colors.map((colorCode) => {
                      const color = allColors.find(c => c.code === colorCode);
                      return (
                        <div key={colorCode} className="w-6 h-6 rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: color?.value || colorCode }} title={color?.name} />
                      );
                    })}
                  </div>
                  
                  {/* عرض خصم الكمية المتدرج في الكارد */}
                  {product.quantityDiscount?.enabled && product.quantityDiscount.tiers && product.quantityDiscount.tiers.length > 0 && (
                    <div className="mb-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                        <span>🎉</span> عروض الكمية:
                      </p>
                      <div className="space-y-1">
                        {product.quantityDiscount.tiers.map((tier: { minQuantity: number; discountPerItem: number }, idx: number) => (
                          tier.discountPerItem > 0 && (
                            <p key={idx} className="text-xs font-bold text-emerald-600">
                              {toArabicNumber(tier.minQuantity)}+ قطعة: خصم {toArabicNumber(tier.discountPerItem)} جنيه لكل قطعة
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50">
                      {deletingId === product.id ? 'جاري الحذف...' : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> حذف</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-black/20" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-black/20 p-4 flex justify-between items-center">
                <h2 className="text-xl font-black text-black">تعديل المنتج</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-black/10 rounded-full transition">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-black text-black mb-1">اسم المنتج</label>
                  <input 
                    type="text" 
                    value={editingProduct.name} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} 
                    className="w-full p-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-black mb-1">السعر (جنيه)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} 
                      className="w-full p-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black mb-1">السعر القديم (للخصم المئوي - اختياري)</label>
                    <input 
                      type="number" 
                      value={editingProduct.oldPrice || ''} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined })} 
                      className="w-full p-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold" 
                    />
                    {calculateDiscountPercent() > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-bold">
                        ✓ نسبة الخصم: {formatDiscount(calculateDiscountPercent())}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-black mb-1">القسم</label>
                    <select 
                      value={editingProduct.category} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} 
                      className="w-full p-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold"
                    >
                      <option value="تيشرتات">تيشرتات</option>
                      <option value="هوديز">هوديز</option>
                      <option value="شروال">شروال</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input 
                      type="checkbox" 
                      id="isNew" 
                      checked={editingProduct.isNew ?? false} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} 
                      className="w-4 h-4 accent-black" 
                    />
                    <label htmlFor="isNew" className="text-sm font-bold text-black">منتج جديد</label>
                  </div>
                </div>
                
                {/* المقاسات */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">المقاسات المتاحة</label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                      <button 
                        type="button" 
                        key={size} 
                        onClick={() => toggleSize(size)} 
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${editingProduct.sizes?.includes(size) ? 'bg-black text-white shadow-md scale-105' : 'bg-black/10 text-black hover:bg-black/20'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* الألوان */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">الألوان المتاحة</label>
                  <div className="flex flex-wrap gap-3">
                    {allColors.map(color => (
                      <button 
                        type="button" 
                        key={color.code} 
                        onClick={() => toggleColor(color.code)} 
                        className={`w-10 h-10 rounded-full transition-all duration-300 ${editingProduct.colors?.includes(color.code) ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-lg' : 'hover:scale-105'}`} 
                        style={{ backgroundColor: color.value, border: color.border ? '1px solid #000000' : 'none' }} 
                        title={color.name} 
                      />
                    ))}
                  </div>
                </div>

                {/* جدول الكميات لكل لون ومقاس */}
                {editingProduct.colors && editingProduct.colors.length > 0 && editingProduct.sizes && editingProduct.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-black text-black mb-2">الكميات المتاحة (لكل لون ومقاس)</label>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-black/5">
                            <th className="border border-black/20 p-2 text-right text-sm font-black text-black">اللون / المقاس</th>
                            {editingProduct.sizes.map(size => (
                              <th key={size} className="border border-black/20 p-2 text-center text-sm font-black text-black">{size}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {editingProduct.colors.map(colorCode => {
                            const colorName = allColors.find(c => c.code === colorCode)?.name || colorCode;
                            const colorValue = allColors.find(c => c.code === colorCode)?.value;
                            return (
                              <tr key={colorCode}>
                                <td className="border border-black/20 p-2 text-sm font-bold text-black">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorValue, border: colorCode === 'white' ? '1px solid #000000' : 'none' }}></div>
                                    {colorName}
                                  </div>
                                </td>
                                {editingProduct.sizes?.map(size => (
                                  <td key={size} className="border border-black/20 p-2">
                                    <input
                                      type="number"
                                      min="0"
                                      value={getStockQuantity(colorCode, size)}
                                      onChange={(e) => updateStockQuantity(colorCode, size, parseInt(e.target.value) || 0)}
                                      className="w-full p-2 text-center bg-white border-2 border-black/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-black/60 mt-2 font-bold">💡 أدخل الكمية المتاحة لكل لون ومقاس (0 يعني غير متاح)</p>
                  </div>
                )}
                
                {/* خصم الكمية المتدرج */}
                <div className="border-t border-black/20 pt-4 mt-2">
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={quantityDiscount.enabled}
                      onChange={(e) => setQuantityDiscount({ ...quantityDiscount, enabled: e.target.checked })}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-black text-black">🎁 تفعيل خصم الكمية المتدرج</span>
                  </label>
                  <p className="text-xs text-black/60 mb-3">ملاحظة: هذا الخصم يضاف فوق الخصم المئوي (إن وجد)</p>
                  
                  {quantityDiscount.enabled && quantityDiscount.tiers && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-black/60">الخصم حسب الكمية (يطبق على الكمية المحددة وكل ما هو أكبر منها):</p>
                      {quantityDiscount.tiers.map((tier: QuantityTier, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-black/5 p-3 rounded-xl">
                          <div className="flex-1">
                            <label className="block text-xs font-black text-black mb-1">من {toArabicNumber(tier.minQuantity)} قطعة فأكثر</label>
                            <input
                              type="number"
                              min={idx === 0 ? 2 : (quantityDiscount.tiers[idx-1]?.minQuantity + 1 || 2)}
                              value={tier.minQuantity}
                              onChange={(e) => updateTier(idx, 'minQuantity', parseInt(e.target.value) || 0)}
                              className="w-full p-2 bg-white border-2 border-black/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-black text-black mb-1">خصم لكل قطعة (جنيه)</label>
                            <input
                              type="number"
                              min="0"
                              value={tier.discountPerItem}
                              onChange={(e) => updateTier(idx, 'discountPerItem', parseInt(e.target.value) || 0)}
                              className="w-full p-2 bg-white border-2 border-black/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full py-2 border-2 border-dashed border-black/30 rounded-xl text-sm font-bold text-black/60 hover:border-green-500 hover:text-green-600 transition"
                      >
                        + إضافة مستوى خصم جديد
                      </button>
                    </div>
                  )}
                </div>
                
                {/* الصور */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">الصور</label>
                  
                  {editingProduct.mainImage && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-black/60 mb-1">الصورة الرئيسية:</p>
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-black/20 bg-gray-50">
                        <Image src={editingProduct.mainImage} alt="main" fill className="object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => removeImage(editingProduct.mainImage, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {editingProduct.subImages && editingProduct.subImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-black/60 mb-1">صور إضافية:</p>
                      <div className="flex flex-wrap gap-2">
                        {editingProduct.subImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-black/20 bg-gray-50">
                            <Image src={img} alt={`sub-${idx}`} fill className="object-contain p-1" />
                            <button
                              type="button"
                              onClick={() => removeImage(img, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-black/60 mb-1">إضافة صورة رئيسية جديدة (اختياري)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewMainImage(e.target.files?.[0] || null)}
                      className="w-full p-2 bg-white border-2 border-black/20 rounded-xl text-black font-bold"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-black/60 mb-1">إضافة صور إضافية جديدة (اختياري)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setNewSubImages(e.target.files ? Array.from(e.target.files) : [])}
                      className="w-full p-2 bg-white border-2 border-black/20 rounded-xl text-black font-bold"
                    />
                    {newSubImages.length > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-bold">✓ تم اختيار {toArabicNumber(newSubImages.length)} صور جديدة</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-black text-black mb-1">الوصف</label>
                  <textarea 
                    value={editingProduct.description} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} 
                    rows={3} 
                    className="w-full p-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold" 
                    required 
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md">
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-black/10 text-black font-bold py-3 rounded-xl hover:bg-black/20 transition-all duration-300">
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
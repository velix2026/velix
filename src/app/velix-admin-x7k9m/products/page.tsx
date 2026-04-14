'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/products';
import { toArabicNumber, formatPrice, formatDiscount } from '@/lib/utils';
import { clothingColors, getColorByCode } from '@/lib/colors';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';

// المقاسات المتاحة
const allSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

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

  // التحقق من الجلسة
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
      loadProducts();
    } else {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
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
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('✅ تم حذف المنتج');
      } else {
        alert('❌ فشل الحذف');
      }
    } catch {
      alert('❌ حدث خطأ');
    } finally {
      setDeletingId(null);
    }
  };

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

  const updateStockQuantity = (colorCode: string, size: string, quantity: number) => {
    setStockItems(prev => {
      const existing = prev.find(item => item.colorCode === colorCode && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.colorCode === colorCode && item.size === size ? { ...item, quantity } : item
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
    const discountPercent = calculateDiscountPercent();
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
    
    if (newMainImage) formData.append('newMainImage', newMainImage);
    newSubImages.forEach(img => formData.append('newSubImages', img));
    
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
        body: formData,
      });
      
      if (res.ok) {
        await loadProducts();
        setEditingProduct(null);
        setNewMainImage(null);
        setNewSubImages([]);
        setRemovedImages([]);
        setStockItems([]);
        setQuantityDiscount({ enabled: false, tiers: [...DEFAULT_TIERS] });
        alert('✅ تم تحديث المنتج');
      } else {
        alert('❌ فشل التحديث');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ حدث خطأ');
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

  const getTotalStock = (stockItemsArray: StockItem[]): number => {
    return stockItemsArray.reduce((sum, item) => sum + item.quantity, 0);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    
    if (product.quantityDiscount && product.quantityDiscount.tiers) {
      setQuantityDiscount({
        enabled: product.quantityDiscount.enabled || false,
        tiers: product.quantityDiscount.tiers.length ? [...product.quantityDiscount.tiers] : [...DEFAULT_TIERS]
      });
    } else {
      setQuantityDiscount({ enabled: false, tiers: [...DEFAULT_TIERS] });
    }
    
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
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-28 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">إدارة المنتجات</h1>
            <p className="text-rose-gold/60 text-sm font-bold mt-1">تعديل وحذف المنتجات</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/${ADMIN_SECRET_PATH}/add-product`}
              className="px-5 py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full text-sm font-bold hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة منتج جديد
            </Link>
            <Link
              href={`/${ADMIN_SECRET_PATH}`}
              className="px-5 py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للداشبورد
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const sizes = product.sizes || [];
            const colors = product.colors || [];
            const totalStock = product.stockItems ? getTotalStock(product.stockItems) : (product.stock || 0);
            const discountPercent = product.oldPrice && product.oldPrice > product.price 
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-rose-gold/20 transition-all duration-300 border border-rose-gold/20 hover:-translate-y-1">
                <div className="relative h-48 w-full bg-rose-gold/5">
                  <Image 
                    src={product.mainImage} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="eager"
                  />
                  {totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-linear-to-r from-gray-600 to-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">خلص</span>
                    </div>
                  )}
                  {totalStock < 5 && totalStock > 0 && (
                    <div className="absolute top-2 right-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ⚡ باقي {toArabicNumber(totalStock)} بس
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-black text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-black/60 text-sm font-bold">{product.category}</p>
                    </div>
                    {product.isNew && <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-xs font-bold px-2 py-1 rounded-full">🆕 جديد</span>}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-black text-rose-gold">{formatPrice(product.price)}</span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-sm text-black/40 line-through font-bold">{formatPrice(product.oldPrice)}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-rose-gold/20 text-rose-gold text-xs px-2 py-0.5 rounded-full font-bold">{formatDiscount(discountPercent)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {sizes.map((size) => <span key={size} className="text-xs bg-rose-gold/10 text-rose-gold font-bold px-2 py-1 rounded">{size}</span>)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {colors.map((colorCode) => {
                      const color = clothingColors.find(c => c.code === colorCode);
                      return (
                        <div key={colorCode} className="w-6 h-6 rounded-full border border-rose-gold/30 shadow-sm" style={{ backgroundColor: color?.code || colorCode }} title={color?.name} />
                      );
                    })}
                  </div>
                  
                  {product.quantityDiscount?.enabled && product.quantityDiscount.tiers && product.quantityDiscount.tiers.length > 0 && (
                    <div className="mb-3 p-2 bg-rose-gold/10 rounded-lg border border-rose-gold/30">
                      <p className="text-xs font-bold text-rose-gold mb-1 flex items-center gap-1">🎉 عروض الكمية:</p>
                      <div className="space-y-1">
                        {product.quantityDiscount.tiers.map((tier: any, idx: number) => (
                          tier.discountPerItem > 0 && (
                            <p key={idx} className="text-xs font-bold text-rose-gold/80">
                              {toArabicNumber(tier.minQuantity)}+ قطعة: خصم {toArabicNumber(tier.discountPerItem)} جنيه لكل قطعة
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)} className="flex-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} className="flex-1 bg-linear-to-r from-gray-500 to-gray-700 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50">
                      {deletingId === product.id ? 'جاري...' : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> حذف</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal - مع علامات الصح للمقاسات والألوان */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-rose-gold/20" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-rose-gold/20 p-4 flex justify-between items-center">
                <h2 className="text-xl font-black text-black">تعديل المنتج</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-rose-gold/10 rounded-full transition">
                  <svg className="w-5 h-5 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-black text-rose-gold mb-1">اسم المنتج</label>
                  <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-rose-gold mb-1">السعر (جنيه)</label>
                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold" required />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-rose-gold mb-1">السعر القديم (اختياري)</label>
                    <input type="number" value={editingProduct.oldPrice || ''} onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold" />
                    {calculateDiscountPercent() > 0 && <p className="text-xs text-rose-gold mt-1 font-bold">✓ الخصم: {formatDiscount(calculateDiscountPercent())}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-rose-gold mb-1">القسم</label>
                    <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold">
                      <option value="تيشرتات">تيشرتات</option>
                      <option value="هوديز">هوديز</option>
                      <option value="شروال">شروال</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" id="isNew" checked={editingProduct.isNew ?? false} onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} className="w-4 h-4 accent-rose-gold" />
                    <label htmlFor="isNew" className="text-sm font-bold text-black">منتج جديد</label>
                  </div>
                </div>
                
                {/* المقاسات - مع علامة صح */}
                <div>
                  <label className="block text-sm font-black text-rose-gold mb-2">المقاسات المتاحة</label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => {
                      const isSelected = editingProduct.sizes?.includes(size);
                      return (
                        <button
                          type="button"
                          key={size}
                          onClick={() => toggleSize(size)}
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
                  {editingProduct.sizes && editingProduct.sizes.length > 0 && (
                    <p className="text-xs text-rose-gold mt-2 font-bold">✓ تم اختيار {toArabicNumber(editingProduct.sizes.length)} مقاس</p>
                  )}
                </div>
                
                {/* الألوان - مع علامة صح */}
                <div>
                  <label className="block text-sm font-black text-rose-gold mb-2">الألوان المتاحة</label>
                  <div className="flex flex-wrap gap-3">
                    {clothingColors.map(color => {
                      const isSelected = editingProduct.colors?.includes(color.code);
                      const isLightColor = color.code === '#FFFFFF' || color.code === '#F5F5DC' || color.code === '#FFF8DC' || color.code === '#FAEBD7';
                      return (
                        <button
                          type="button"
                          key={color.code}
                          onClick={() => toggleColor(color.code)}
                          className={`relative w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                            isSelected ? 'ring-2 ring-offset-2 ring-rose-gold scale-110 shadow-lg' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.code, border: color.code === '#FFFFFF' ? '1px solid #000' : 'none' }}
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
                  {editingProduct.colors && editingProduct.colors.length > 0 && (
                    <p className="text-xs text-rose-gold mt-2 font-bold">✓ تم اختيار {toArabicNumber(editingProduct.colors.length)} لون</p>
                  )}
                </div>

                {/* جدول الكميات */}
                {editingProduct.colors && editingProduct.colors.length > 0 && editingProduct.sizes && editingProduct.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-black text-rose-gold mb-2">الكميات المتاحة</label>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-rose-gold/10">
                            <th className="border border-rose-gold/20 p-2 text-right text-sm font-black text-black">اللون / المقاس</th>
                            {editingProduct.sizes.map(size => (
                              <th key={size} className="border border-rose-gold/20 p-2 text-center text-sm font-black text-black">{size}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {editingProduct.colors.map(colorCode => {
                            const colorName = getColorName(colorCode);
                            const colorValue = getColorValue(colorCode);
                            return (
                              <tr key={colorCode}>
                                <td className="border border-rose-gold/20 p-2 text-sm font-bold text-black">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorValue, border: colorCode === '#FFFFFF' ? '1px solid #000' : 'none' }} />
                                    {colorName}
                                  </div>
                                </td>
                                {editingProduct.sizes?.map(size => (
                                  <td key={size} className="border border-rose-gold/20 p-2">
                                    <input
                                      type="number"
                                      min="0"
                                      value={getStockQuantity(colorCode, size)}
                                      onChange={(e) => updateStockQuantity(colorCode, size, parseInt(e.target.value) || 0)}
                                      className="w-full p-2 text-center bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                                    />
                                  </td>
                                ))}
                               </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-rose-gold/60 mt-2 font-bold">💡 أدخل الكمية لكل لون ومقاس (0 يعني مش متاح)</p>
                  </div>
                )}
                
                {/* خصم الكمية */}
                <div className="border-t border-rose-gold/20 pt-4 mt-2">
                  <label className="flex items-center gap-2 mb-3">
                    <input type="checkbox" checked={quantityDiscount.enabled} onChange={(e) => setQuantityDiscount({ ...quantityDiscount, enabled: e.target.checked })} className="w-4 h-4 accent-rose-gold" />
                    <span className="text-sm font-black text-black">🎁 تفعيل خصم الكمية</span>
                  </label>
                  <p className="text-xs text-rose-gold/60 mb-3">الخصم ده يضاف فوق الخصم المئوي (لو موجود)</p>
                  
                  {quantityDiscount.enabled && quantityDiscount.tiers && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-rose-gold/80">الخصم حسب الكمية:</p>
                      {quantityDiscount.tiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-rose-gold/5 p-3 rounded-xl border border-rose-gold/20">
                          <div className="flex-1">
                            <label className="block text-xs font-black text-black mb-1">من {toArabicNumber(tier.minQuantity)} قطعة فأكثر</label>
                            <input type="number" min={idx === 0 ? 2 : (quantityDiscount.tiers[idx-1]?.minQuantity + 1 || 2)} value={tier.minQuantity} onChange={(e) => updateTier(idx, 'minQuantity', parseInt(e.target.value) || 0)} className="w-full p-2 bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-black text-black mb-1">خصم لكل قطعة (جنيه)</label>
                            <input type="number" min="0" value={tier.discountPerItem} onChange={(e) => updateTier(idx, 'discountPerItem', parseInt(e.target.value) || 0)} className="w-full p-2 bg-white border-2 border-rose-gold/20 rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent" />
                          </div>
                          {quantityDiscount.tiers.length > 1 && (
                            <button type="button" onClick={() => removeTier(idx)} className="mt-5 text-red-500 hover:text-red-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addTier} className="w-full py-2 border-2 border-dashed border-rose-gold/30 rounded-xl text-sm font-bold text-rose-gold hover:border-rose-gold/50 hover:text-copper transition">+ إضافة مستوى خصم جديد</button>
                    </div>
                  )}
                </div>
                
                {/* الصور */}
                <div>
                  <label className="block text-sm font-black text-rose-gold mb-2">الصور</label>
                  
                  {editingProduct.mainImage && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-rose-gold/60 mb-1">الصورة الرئيسية:</p>
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-rose-gold/20 bg-rose-gold/5">
                        <Image 
                          src={editingProduct.mainImage} 
                          alt="main" 
                          fill 
                          className="object-contain p-1"
                          sizes="96px"
                        />
                        <button type="button" onClick={() => removeImage(editingProduct.mainImage, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition">✕</button>
                      </div>
                    </div>
                  )}
                  
                  {editingProduct.subImages && editingProduct.subImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-rose-gold/60 mb-1">صور إضافية:</p>
                      <div className="flex flex-wrap gap-2">
                        {editingProduct.subImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-rose-gold/20 bg-rose-gold/5">
                            <Image 
                              src={img} 
                              alt={`sub-${idx}`} 
                              fill 
                              className="object-contain p-1"
                              sizes="80px"
                            />
                            <button type="button" onClick={() => removeImage(img, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-rose-gold/60 mb-1">صورة رئيسية جديدة (اختياري)</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewMainImage(e.target.files?.[0] || null)} className="w-full p-2 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl text-black font-bold" />
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-rose-gold/60 mb-1">صور إضافية جديدة (اختياري)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setNewSubImages(e.target.files ? Array.from(e.target.files) : [])} className="w-full p-2 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl text-black font-bold" />
                    {newSubImages.length > 0 && <p className="text-xs text-rose-gold mt-1 font-bold">✓ تم اختيار {toArabicNumber(newSubImages.length)} صور جديدة</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-black text-rose-gold mb-1">الوصف</label>
                  <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold" required />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md">
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-rose-gold/10 text-rose-gold py-3 rounded-xl font-bold hover:bg-rose-gold/20 transition-all duration-300">
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
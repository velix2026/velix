'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { toArabicNumber, formatPrice } from '@/lib/utils';
import { getColorByCode } from '@/lib/colors';
import SizeGuideModal from '@/components/SizeGuideModal';

interface ProductActionsProps {
  product: any;
  onOrder: (data: { size: string; color: string; quantity: number }) => void;
}

interface MultiItem {
  id: string;
  size: string;
  color: string;
  quantity: number;
}

// دالة حساب السعر بعد خصم الكمية
const getQuantityDiscountPrice = (product: any, quantity: number) => {
  if (!product.quantityDiscount?.enabled) return product.price * quantity;
  const { tiers } = product.quantityDiscount;
  let applicableTier = null;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (quantity >= tiers[i].minQuantity) { applicableTier = tiers[i]; break; }
  }
  if (!applicableTier) return product.price * quantity;
  return quantity * (product.price - applicableTier.discountPerItem);
};

// دالة حساب الكمية المتاحة
const getAvailableStock = (product: any, size: string, color: string): number => {
  if (product.stockItems && Array.isArray(product.stockItems) && size && color) {
    const stockItem = product.stockItems.find((item: any) => item.size === size && item.colorCode === color);
    return stockItem?.quantity || 0;
  }
  return product.stock || 0;
};

// دالة الحصول على اسم اللون من lib/colors
const getColorName = (colorCode: string): string => {
  const color = getColorByCode(colorCode);
  return color.name || colorCode;
};

// دالة جلب تفاصيل اللون
const getColorDetails = (colorCode: string) => {
  const fromLib = getColorByCode(colorCode);
  if (fromLib.name !== colorCode) {
    return { name: fromLib.name, value: colorCode, code: colorCode, border: colorCode === '#FFFFFF' };
  }
  return { name: colorCode, value: colorCode, code: colorCode, border: colorCode === '#FFFFFF' };
};

export default function ProductActions({ product, onOrder }: ProductActionsProps) {
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [items, setItems] = useState<MultiItem[]>([{ id: Date.now().toString(), size: '', color: '', quantity: 1 }]);
  const [singleSelection, setSingleSelection] = useState({ size: '', color: '', quantity: 1 });
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  const { addToCart, removeFromCartByProductId, isInCart, cart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const sizes: string[] = product.sizes || [];
  const colors: string[] = product.colors || [];
  const singleAvailableStock = getAvailableStock(product, singleSelection.size, singleSelection.color);
  const isInCartState = isInCart(product.id);
  const isFavoritedState = isFavorite(product.id);

  // تحديث الـ UI عند تغير السلة
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [cart, product.id]);

  useEffect(() => {
    setSingleSelection(prev => ({ ...prev, size: sizes[0] || '', color: colors[0] || '' }));
  }, [sizes, colors]);

  useEffect(() => {
    setSingleSelection(prev => ({ ...prev, quantity: 1 }));
  }, [singleSelection.size, singleSelection.color]);

  const addItem = () => setItems(prev => [...prev, { id: Date.now().toString() + Math.random(), size: sizes[0] || '', color: colors[0] || '', quantity: 1 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(prev => prev.filter(item => item.id !== id)); };
  const updateItem = (id: string, field: keyof MultiItem, value: string | number) => setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  const applySizeToAll = (size: string) => setItems(prev => prev.map(item => ({ ...item, size })));
  const applyColorToAll = (color: string) => setItems(prev => prev.map(item => ({ ...item, color })));
  const setAllQuantities = (quantity: number) => setItems(prev => prev.map(item => ({ ...item, quantity })));

  const mergeIdenticalItems = (itemsList: MultiItem[]) => {
    const merged = new Map<string, MultiItem>();
    for (const item of itemsList) {
      const key = `${item.size}|${item.color}`;
      if (merged.has(key)) merged.get(key)!.quantity += item.quantity;
      else merged.set(key, { ...item, id: item.id });
    }
    return Array.from(merged.values());
  };

  const getTotalQuantity = () => isMultiMode ? items.reduce((sum, item) => sum + item.quantity, 0) : singleSelection.quantity;
  const getTotalPrice = () => getQuantityDiscountPrice(product, getTotalQuantity());
  const getOriginalPrice = () => product.price * getTotalQuantity();
  const getSavings = () => getOriginalPrice() - getTotalPrice();

  const validateMultiItems = () => {
    for (const item of items) {
      if (sizes.length > 0 && !item.size) { alert('اختار المقاس لكل القطع'); return false; }
      if (colors.length > 0 && !item.color) { alert('اختار اللون لكل القطع'); return false; }
      const availableStock = getAvailableStock(product, item.size, item.color);
      if (item.quantity > availableStock) {
        alert(`⚠️ الكمية المطلوبة (${item.quantity}) للقطعة (مقاس ${item.size}، لون ${getColorName(item.color)}) أكتر من المتاح (${availableStock})`);
        return false;
      }
    }
    return true;
  };

  const handleAddMultiToCart = () => {
    if (!validateMultiItems()) return;
    const mergedItems = mergeIdenticalItems(items);
    for (const item of mergedItems) {
      for (let i = 0; i < item.quantity; i++) addToCart(product, item.size || undefined, item.color || undefined, 1);
    }
    setItems([{ id: Date.now().toString(), size: sizes[0] || '', color: colors[0] || '', quantity: 1 }]);
    setIsMultiMode(false);
    setForceUpdate(prev => prev + 1);
  };

  const handleAddSingleToCart = () => {
    if (sizes.length > 0 && !singleSelection.size) { alert('اختار المقاس'); return; }
    if (colors.length > 0 && !singleSelection.color) { alert('اختار اللون'); return; }
    if (singleSelection.quantity > singleAvailableStock) {
      alert(`⚠️ الكمية المطلوبة (${singleSelection.quantity}) أكتر من المتاح (${singleAvailableStock})`);
      return;
    }
    addToCart(product, singleSelection.size || undefined, singleSelection.color || undefined, singleSelection.quantity);
    setForceUpdate(prev => prev + 1);
  };

  const handleRemoveFromCart = () => {
    removeFromCartByProductId(product.id, product.name);
    setForceUpdate(prev => prev + 1);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    setForceUpdate(prev => prev + 1);
  };

  const totalQuantity = getTotalQuantity();
  const hasDiscount = product.quantityDiscount?.enabled && totalQuantity >= (product.quantityDiscount.tiers?.[0]?.minQuantity || 999);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-6">
        
        {/* ✅ زر دليل المقاسات */}
        <div className="mb-4">
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-rose-gold hover:text-copper transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="border-b border-rose-gold/30 group-hover:border-rose-gold transition">📏 مش عارف مقاسك؟ شوف دليل المقاسات</span>
          </button>
        </div>

        {/* زر التبديل */}
        <div className="mb-4 flex justify-end">
          <button onClick={() => setIsMultiMode(!isMultiMode)} className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 ${isMultiMode ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white' : 'bg-rose-gold/10 text-rose-gold hover:bg-rose-gold/20'}`}>
            {isMultiMode ? <>✓ وضع فردي</> : <>➕ طلب متعدد (أضف أكتر من قطعة)</>}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isMultiMode ? (
            <motion.div key="multi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
              {items.length > 1 && (
                <div className="bg-rose-gold/5 rounded-xl p-3 border border-rose-gold/20">
                  <p className="text-xs font-bold text-black mb-2">إجراءات سريعة:</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.length > 0 && (
                      <select onChange={(e) => applySizeToAll(e.target.value)} className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-rose-gold" defaultValue="">
                        <option value="" disabled>تطبيق مقاس على الكل</option>
                        {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                      </select>
                    )}
                    {colors.length > 0 && (
                      <select onChange={(e) => applyColorToAll(e.target.value)} className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-rose-gold" defaultValue="">
                        <option value="" disabled>تطبيق لون على الكل</option>
                        {colors.map(color => <option key={color} value={color}>{getColorName(color)}</option>)}
                      </select>
                    )}
                    <button onClick={() => setAllQuantities(1)} className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-rose-gold hover:bg-rose-gold/10">ضبط الكل على 1</button>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1">
                {items.map((item, index) => {
                  const itemAvailableStock = getAvailableStock(product, item.size, item.color);
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-gold/5 rounded-xl p-3 relative border border-rose-gold/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-black/70">القطعة {toArabicNumber(index + 1)}</span>
                        {items.length > 1 && <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">إزالة</button>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sizes.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-black mb-1.5">المقاس</p>
                            <div className="flex flex-wrap gap-1">
                              {sizes.map((size) => (
                                <button key={size} onClick={() => updateItem(item.id, 'size', size)} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${item.size === size ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white' : 'bg-white text-black border border-rose-gold/20'}`}>{size}</button>
                              ))}
                            </div>
                          </div>
                        )}
                        {colors.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-black mb-1.5">اللون</p>
                            <div className="flex flex-wrap gap-1">
                              {colors.map((color) => {
                                const colorDetail = getColorDetails(color);
                                const isSelected = item.color === color;
                                return (
                                  <button key={color} onClick={() => updateItem(item.id, 'color', color)} className={`relative w-7 h-7 rounded-full transition-all ${isSelected ? 'ring-2 ring-offset-1 ring-rose-gold scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: colorDetail.value, border: colorDetail.border ? '1px solid #000' : 'none' }} title={colorDetail.name}>
                                    {isSelected && <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-black">الكمية:</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))} className="w-6 h-6 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10">-</button>
                          <span className="w-8 text-center text-sm font-bold text-black">{toArabicNumber(item.quantity)}</span>
                          <button onClick={() => { const newQ = item.quantity + 1; if (newQ <= itemAvailableStock) updateItem(item.id, 'quantity', newQ); else alert(`⚠️ معندناش غير ${itemAvailableStock} قطعة`); }} className="w-6 h-6 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10">+</button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={addItem} className="w-full py-2 rounded-xl border-2 border-dashed border-rose-gold/30 text-rose-gold text-sm font-bold hover:border-rose-gold/50 transition-all">+ إضافة قطعة تانية</button>

              <div className="bg-rose-gold/5 rounded-xl p-3 border border-rose-gold/20">
                <div className="flex justify-between items-center"><span className="text-sm font-bold text-black/70">إجمالي القطع:</span><span className="text-sm font-bold text-rose-gold">{toArabicNumber(totalQuantity)} قطعة</span></div>
                <div className="flex justify-between items-center mt-1"><span className="text-sm font-bold text-black/70">الإجمالي:</span><span className="text-lg font-bold text-rose-gold">{formatPrice(getTotalPrice())}</span></div>
                {hasDiscount && <div className="mt-2 text-xs text-rose-gold font-bold text-center">🎉 خصم الكمية: وفرت {formatPrice(getSavings())}</div>}
              </div>

              <button onClick={handleAddMultiToCart} disabled={totalQuantity === 0} className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-lg">أضف ({toArabicNumber(totalQuantity)}) قطعة للسلة</button>
            </motion.div>
          ) : (
            <motion.div key="single" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="flex text-sm font-bold text-black mb-3 items-center gap-2">اختر المقاس:</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button key={size} onClick={() => setSingleSelection(prev => ({ ...prev, size }))} className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold ${singleSelection.size === size ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white border-rose-gold shadow-lg scale-105' : 'bg-white text-black border-rose-gold/20 hover:border-rose-gold hover:scale-105'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="flex text-sm font-bold text-black mb-3 items-center gap-2">اختر اللون:</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((colorCode) => {
                      const color = getColorDetails(colorCode);
                      const isSelected = singleSelection.color === colorCode;
                      return (
                        <button key={colorCode} onClick={() => setSingleSelection(prev => ({ ...prev, color: colorCode }))} className={`relative w-10 h-10 rounded-full transition-all duration-200 ${isSelected ? 'ring-2 ring-offset-2 ring-rose-gold scale-110 shadow-lg' : 'hover:scale-110'}`} style={{ backgroundColor: color.value, border: color.border ? '1px solid #000000' : 'none' }} title={color.name}>
                          {isSelected && <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-3">الكمية:</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-rose-gold/5 rounded-full">
                    <button onClick={() => setSingleSelection(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))} className="w-10 h-10 rounded-full hover:bg-rose-gold/10 transition flex items-center justify-center text-lg font-bold text-black">-</button>
                    <span className="w-12 text-center text-xl font-black text-black">{toArabicNumber(singleSelection.quantity)}</span>
                    <button onClick={() => setSingleSelection(prev => ({ ...prev, quantity: Math.min(singleAvailableStock, prev.quantity + 1) }))} disabled={singleSelection.quantity >= singleAvailableStock} className="w-10 h-10 rounded-full hover:bg-rose-gold/10 transition flex items-center justify-center text-lg font-bold text-black disabled:opacity-40">+</button>
                  </div>
                  <span className="text-sm font-bold text-black/60"><span className="font-black text-rose-gold">{toArabicNumber(singleAvailableStock)}</span> قطعة متاحة</span>
                </div>
              </div>

              {product.quantityDiscount?.enabled && singleSelection.quantity >= (product.quantityDiscount.tiers?.[0]?.minQuantity || 999) && (
                <div className="mb-4 p-3 bg-rose-gold/10 rounded-xl border border-rose-gold/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-lg">🎉</span><span className="text-sm font-black text-rose-gold">خصم الكمية!</span></div>
                    <div className="text-right"><div className="text-xs text-rose-gold/60 line-through">{formatPrice(getOriginalPrice())}</div><div className="text-sm font-black text-rose-gold">{formatPrice(getTotalPrice())}</div></div>
                  </div>
                  <p className="text-xs text-rose-gold mt-1 font-bold">وفرت {formatPrice(getSavings())}</p>
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <button onClick={() => onOrder(singleSelection)} disabled={singleAvailableStock === 0} className="flex-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-3.5 rounded-full hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-lg">اطلب دلوقتي</button>
                {isInCartState ? (
                  <button onClick={handleRemoveFromCart} className="flex-1 bg-linear-to-r from-gray-500 to-gray-700 text-white font-bold py-3.5 rounded-full hover:scale-[1.02] transition-all duration-300 shadow-lg">شيل من السلة</button>
                ) : (
                  <button onClick={handleAddSingleToCart} disabled={singleAvailableStock === 0} className="flex-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-3.5 rounded-full hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-lg">ضيف للسلة</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-4">
          <button onClick={handleToggleFavorite} className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${isFavoritedState ? 'bg-rose-gold text-white border-rose-gold' : 'bg-white text-black border-rose-gold/20 hover:border-rose-gold hover:bg-rose-gold/5'}`}>
            <svg className="w-5 h-5" fill={isFavoritedState ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {isFavoritedState ? 'في المفضلة' : 'ضيف للمفضلة'}
          </button>
          <button onClick={async () => { const url = window.location.href; if (navigator.share) { try { await navigator.share({ title: `VELIX - ${product.name}`, text: `شوف منتج ${product.name} من VELIX`, url }); } catch (err) {} } else { await navigator.clipboard.writeText(url); alert('تم نسخ الرابط 📋'); } }} className="py-3 px-6 rounded-full font-bold bg-white text-black border-2 border-rose-gold/20 hover:border-rose-gold hover:bg-rose-gold/5 transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            مشاركة
          </button>
        </div>
      </motion.div>

      {/* ✅ مودال دليل المقاسات */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </>
  );
}
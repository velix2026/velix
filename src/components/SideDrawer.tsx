'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart, CartItem } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import OrderModal from './OrderModal';
import { toArabicNumber, formatPrice } from '@/lib/utils';
import { getColorByCode } from '@/lib/colors';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'favorites' | 'cart';
}

const getColorName = (colorCode: string): string => {
  if (!colorCode) return 'غير محدد';
  const color = getColorByCode(colorCode);
  return color.name || colorCode;
};

const getItemTotalPrice = (item: CartItem): number => {
  const totalQuantity = item.variations?.reduce((sum, v) => sum + v.quantity, 0) || item.quantity || 1;
  
  if (!item.quantityDiscount?.enabled) return item.price * totalQuantity;
  
  const { tiers } = item.quantityDiscount;
  let applicableTier = null;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalQuantity >= tiers[i].minQuantity) {
      applicableTier = tiers[i];
      break;
    }
  }
  if (!applicableTier) return item.price * totalQuantity;
  return totalQuantity * (item.price - applicableTier.discountPerItem);
};

const getProductTotalQuantity = (item: CartItem): number => {
  if (item.variations && item.variations.length > 0) {
    return item.variations.reduce((sum, v) => sum + v.quantity, 0);
  }
  return item.quantity || 1;
};

export default function SideDrawer({ isOpen, onClose, type }: SideDrawerProps) {
  const title = type === 'favorites' ? 'المفضلة' : 'سلة التسوق';
  const emptyMessage = type === 'favorites' ? 'لسه مفيش حاجة في المفضلة' : 'السلة فاضية';
  
  const { cart, removeVariation, removeFromCartByProductSlug, updateVariationQuantity, clearCart } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  
  const items = type === 'cart' ? cart : favorites;
  const [total, setTotal] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (type === 'cart') {
      const sum = cart.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
      setTotal(sum);
    }
  }, [cart, type]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) closeButtonRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ✅ استخدام slug بدل id
  const handleRemoveVariation = useCallback((productSlug: string, variationId: string, productName: string, variationDesc: string) => {
    removeVariation(productSlug, variationId, productName, variationDesc);
  }, [removeVariation]);

  const handleRemoveProduct = useCallback((productSlug: string, productName: string) => {
    removeFromCartByProductSlug(productSlug, productName);
  }, [removeFromCartByProductSlug]);

  const openOrderModal = useCallback(() => {
    if (cart.length === 0) return;
    const orderData = {
      items: cart.map(item => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        oldPrice: item.oldPrice,
        mainImage: item.mainImage,
        quantityDiscount: item.quantityDiscount,
        variations: item.variations
      })),
      totalAmount: total,
      totalItems: cart.reduce((sum, item) => sum + getProductTotalQuantity(item), 0),
    };
    localStorage.setItem('tempOrderData', JSON.stringify(orderData));
    setIsOrderModalOpen(true);
  }, [cart, total]);

  const handleOrderSubmit = useCallback(async (orderData: any) => {
    try {
      clearCart();
      localStorage.removeItem('tempOrderData');
      setIsOrderModalOpen(false);
      onClose();
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: '✅ تم تأكيد طلبك! هنكلمك على واتساب قريب', type: 'success' }
      }));
    } catch (error) { console.error('Order submission error:', error); }
  }, [clearCart, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300" onClick={onClose} aria-hidden="true" />
      
      <div role="dialog" aria-modal="true" aria-label={title} className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-full sm:w-112.5 md:w-125 lg:w-137.5 max-w-[85vw]`}>
        
        <div className="flex items-center justify-between p-4 border-b border-rose-gold/20 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button ref={closeButtonRef} onClick={onClose} className="p-2 rounded-full transition-all duration-300 hover:bg-rose-gold/10 hover:text-rose-gold" aria-label="إغلاق">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4" style={{ height: type === 'cart' && items.length > 0 ? 'calc(100% - 73px - 140px)' : 'calc(100% - 73px)', WebkitOverflowScrolling: 'touch' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-100 text-center">
              <div className="text-6xl mb-4 opacity-50">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-black/60 font-bold text-sm">{emptyMessage}</p>
              <button onClick={() => { onClose(); window.location.href = '/products'; }} className="mt-4 text-sm text-rose-gold font-bold hover:underline transition">تسوق دلوقتي</button>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {items.map((item) => {
                const isCartItem = type === 'cart';
                const cartItem = item as CartItem;
                const totalQuantity = isCartItem ? getProductTotalQuantity(cartItem) : 1;
                const hasDiscount = isCartItem && cartItem.quantityDiscount?.enabled && totalQuantity >= (cartItem.quantityDiscount.tiers?.[0]?.minQuantity || 999);
                
                return (
                  <div key={isCartItem ? cartItem.cartItemId : `fav-${item.slug}`} className="bg-rose-gold/5 rounded-xl p-3 hover:shadow-md hover:border hover:border-rose-gold/20 transition-all duration-300">
                    <div className="flex gap-3">
                      <Link href={`/products/${item.slug}`} onClick={onClose} className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0 transition-all hover:scale-105">
                        <Image src={item.mainImage} alt={item.name} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} onClick={onClose} className="font-bold text-sm text-black hover:text-rose-gold transition line-clamp-2">{item.name}</Link>
                        <p className="text-black/50 font-bold text-xs mb-2">{item.category}</p>
                        
                        {isCartItem && cartItem.variations && cartItem.variations.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {cartItem.variations.map((variation) => {
                              const variationTotal = variation.quantity * item.price;
                              return (
                                <div key={variation.variationId} className="bg-white/50 rounded-lg p-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex flex-wrap gap-1">
                                      {variation.size && <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold">مقاس: {variation.size}</span>}
                                      {variation.color && <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: variation.color }} />لون: {getColorName(variation.color)}</span>}
                                    </div>
                                    <button onClick={() => handleRemoveVariation(item.slug, variation.variationId, item.name, `${variation.size ? `مقاس ${variation.size}` : ''}${variation.size && variation.color ? ' ' : ''}${variation.color ? getColorName(variation.color) : ''}`)} className="text-red-400 hover:text-red-600 transition p-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => updateVariationQuantity(item.slug, variation.variationId, Math.max(1, variation.quantity - 1))} className="w-6 h-6 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10 transition">-</button>
                                      <span className="w-8 text-center text-xs font-bold text-black">{toArabicNumber(variation.quantity)}</span>
                                      <button onClick={() => updateVariationQuantity(item.slug, variation.variationId, variation.quantity + 1)} className="w-6 h-6 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10 transition">+</button>
                                    </div>
                                    <span className="font-bold text-sm text-rose-gold">{formatPrice(variationTotal)}</span>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="flex justify-between items-center pt-2 border-t border-rose-gold/20 mt-2">
                              <span className="font-bold text-sm text-black">إجمالي المنتج:</span>
                              <span className="font-bold text-sm text-rose-gold">{formatPrice(getItemTotalPrice(cartItem))}</span>
                            </div>
                            
                            {hasDiscount && (
                              <div className="text-xs text-rose-gold font-bold bg-rose-gold/10 p-1 rounded text-center">
                                🎉 خصم الكمية مطبق على {toArabicNumber(totalQuantity)} قطعة
                              </div>
                            )}
                          </div>
                        )}
                        
                        {type === 'favorites' && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-sm text-rose-gold">{formatPrice(item.price)}</span>
                            <button onClick={() => removeFromFavorites(item.slug, item.name)} className="text-red-400 hover:text-red-600 transition p-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {type === 'cart' && items.length > 0 && (
          <div className="border-t border-rose-gold/20 p-4 bg-white sticky bottom-0 z-10 shadow-lg rounded-t-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-black font-bold text-sm">الإجمالي الكلي</span>
              <span className="text-xl font-bold text-rose-gold">{formatPrice(total)}</span>
            </div>
            <button onClick={openOrderModal} className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 text-sm shadow-md hover:shadow-rose-gold/30">أطلب دلوقتي</button>
            <button onClick={() => { onClose(); window.location.href = '/products'; }} className="w-full text-center text-xs font-bold text-rose-gold/50 hover:text-rose-gold mt-3 transition">كمل تسوق</button>
          </div>
        )}
      </div>

      {isOrderModalOpen && cart.length > 0 && (
        <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} product={{
          id: 0,
          name: `طلب متعدد (${toArabicNumber(cart.length)} منتج)`,
          price: total,
          mainImage: cart[0]?.mainImage || '',
          quantity: 1,
        }} onSubmit={handleOrderSubmit} />
      )}
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import OrderModal from '@/components/OrderModal';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import RelatedProducts from '@/components/product/RelatedProducts';
import { createPortal } from 'react-dom';

export const dynamic = 'force-dynamic';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSelection, setOrderSelection] = useState({ size: '', color: '', quantity: 1 });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document.getElementById('product-actions-portal'));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const allProducts = await getProducts();
      const found = allProducts.find(p => p.id === parseInt(params.id as string));
      setProduct(found);
      
      if (found) {
        const related = allProducts
          .filter(p => p.category === found.category && p.id !== found.id)
          .slice(0, 8);
        setRelatedProducts(related);
      }
      
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  // تتبع مشاهدة المنتج
  useEffect(() => {
    if (product?.id) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'view_product',
          productId: product.id,
        }),
      });
    }
  }, [product?.id]);

  const handleOrder = (selection: { size: string; color: string; quantity: number }) => {
    setOrderSelection(selection);
    setIsOrderModalOpen(true);
  };

  const handleAddToCart = (selection: { size: string; color: string; quantity: number }) => {
    console.log('Added to cart:', selection);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-2xl animate-pulse h-[400px] md:h-[500px]" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
          <Link href="/products" className="text-black underline">
            العودة إلى المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.mainImage, ...product.subImages];
  const stock = product.stock || 0;

  return (
    <>
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb مع أزرار جانبية */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              <Link href="/" className="hover:text-black">الرئيسية</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-black">المنتجات</Link>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-black">
                {product.category}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-black">{product.name}</span>
            </div>
            
            {/* مكان الأزرار - سيتم وضعها هنا عبر الـ Portal */}
            <div id="product-actions-portal" className="flex items-center gap-3" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* قسم الصور */}
            <ProductImages images={allImages} productName={product.name} stock={stock} />

            {/* معلومات المنتج */}
            <div>
              <ProductInfo product={product} />
              <ProductActions 
                product={product} 
                onOrder={handleOrder} 
                onAddToCart={handleAddToCart} 
              />
            </div>
          </div>

          {/* منتجات ذات صلة */}
          <RelatedProducts products={relatedProducts} currentProductId={product.id} />
        </div>
      </div>

      {/* Portal لنقل الأزرار */}
      {portalElement && createPortal(
        <>
          <button
            onClick={() => {
              const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
              const exists = favorites.some((p: any) => p.id === product.id);
              if (exists) {
                const newFavorites = favorites.filter((p: any) => p.id !== product.id);
                localStorage.setItem('favorites', JSON.stringify(newFavorites));
              } else {
                favorites.push(product);
                localStorage.setItem('favorites', JSON.stringify(favorites));
              }
              window.dispatchEvent(new CustomEvent('favoritesUpdated'));
            }}
            className={`p-2 rounded-full border transition flex items-center justify-center ${
              (() => {
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const isFav = favorites.some((p: any) => p.id === product.id);
                return isFav
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black';
              })()
            }`}
            aria-label="المفضلة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `VELIX - ${product.name}`,
                    text: `شوف منتج ${product.name} من VELIX`,
                    url,
                  });
                } catch (err) {
                  console.log('Error sharing:', err);
                }
              } else {
                await navigator.clipboard.writeText(url);
                alert('تم نسخ رابط المنتج 📋');
              }
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition flex items-center justify-center"
            aria-label="مشاركة المنتج"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </>,
        portalElement
      )}

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage,
          selectedSize: orderSelection.size,
          selectedColor: orderSelection.color,
          quantity: orderSelection.quantity,
        }}
        onSubmit={handleOrderSubmit}
      />
    </>
  );
}
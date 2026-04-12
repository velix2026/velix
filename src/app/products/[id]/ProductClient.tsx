// app/products/[id]/ProductClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OrderModal from '@/components/OrderModal';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductSkeleton from '@/components/product/ProductSkeleton';

export const dynamic = 'force-dynamic';

// دالة حساب إجمالي الكمية من stockItems
const getTotalStock = (product: any): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

// ✅ دالة توليد JSON-LD للمنتج
const generateProductSchema = (product: any, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.mainImage,
    "sku": `VELIX-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "VELIX"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "EGP",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": getTotalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "VELIX"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EGP"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
            "opens": "10:00",
            "closes": "18:00"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "EG",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": product.rating && product.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.salesCount || 0
    } : undefined
  };
};

interface ProductClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSelection, setOrderSelection] = useState({ size: '', color: '', quantity: 1 });

  useEffect(() => {
    if (product?.id) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'view_product',
          productId: product.id,
        }),
      }).catch(() => {});
    }
  }, [product?.id]);

  const handleOrder = (selection: { size: string; color: string; quantity: number }) => {
    setOrderSelection(selection);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
    setIsOrderModalOpen(false);
  };

  const allImages = [product.mainImage, ...product.subImages];
  const stock = getTotalStock(product);
  const productUrl = `https://velix-eg.store/products/${product.id}`;

  return (
    <>
      {/* ✅ JSON-LD للمنتج - أهم حاجة للسيو */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product, productUrl))
        }}
      />
      
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb - أزرار جرادينت أنيقة */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            {/* زر الرئيسية - جرادينت */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-black via-black/80 to-black/60 hover:from-black/80 hover:via-black/60 hover:to-black/40 text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>الرئيسية</span>
            </Link>

            {/* سهم */}
            <svg className="w-3 h-3 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>

            {/* زر المنتجات - جرادينت أزرق سماوي */}
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-400 hover:via-blue-400 hover:to-indigo-400 text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <span>المنتجات</span>
            </Link>

            {/* سهم */}
            <svg className="w-3 h-3 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>

            {/* زر التصنيف - جرادينت زمردي/أخضر */}
            <Link 
              href={`/products?category=${encodeURIComponent(product.category)}`} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-emerald-500 via-green-500 to-lime-500 hover:from-emerald-400 hover:via-green-400 hover:to-lime-400 text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105"
            >
              {product.category === 'تيشرتات' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              )}
              {product.category === 'هوديز' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {product.category === 'شروال' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14M5 5v14M5 5l4 4m10-4l-4 4" />
                </svg>
              )}
              <span>{product.category}</span>
            </Link>

            {/* سهم */}
            <svg className="w-3 h-3 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>

            {/* زر المنتج الحالي - جرادينت وردي/بنفسجي فخم */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 text-white rounded-full transition-all duration-300 text-sm font-bold shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="truncate max-w-36 sm:max-w-48">{product.name}</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* قسم الصور - مع تكبير */}
            <ProductImages images={allImages} productName={product} stock={stock} />

            {/* معلومات المنتج */}
            <div>
              <ProductInfo product={product} />
              <ProductActions product={product} onOrder={handleOrder} />
            </div>
          </div>

          {/* منتجات ذات صلة */}
          <RelatedProducts products={relatedProducts} currentProductId={product.id} />
        </div>
      </div>

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
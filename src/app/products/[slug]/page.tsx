// app/products/[slug]/ProductClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OrderModal from '@/components/OrderModal';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import RelatedProducts from '@/components/product/RelatedProducts';
import { getTotalStock } from '@/lib/products';

export const dynamic = 'force-dynamic';

// دالة توليد JSON-LD للمنتج
const generateProductSchema = (product: any, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.mainImage,
    "sku": `VELIX-${product.slug}`,  // ✅ slug بدل id
    "brand": { "@type": "Brand", "name": "VELIX" },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "EGP",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": getTotalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "VELIX" },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EGP" },
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

// دالة توليد Breadcrumbs JSON-LD
const generateBreadcrumbSchema = (product: any, categoryName: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://velix-eg.store/" },
      { "@type": "ListItem", "position": 2, "name": "المنتجات", "item": "https://velix-eg.store/products" },
      { "@type": "ListItem", "position": 3, "name": categoryName, "item": `https://velix-eg.store/products?category=${encodeURIComponent(categoryName)}` },
      { "@type": "ListItem", "position": 4, "name": product.name, "item": `https://velix-eg.store/products/${product.slug}` }  // ✅ slug بدل id
    ]
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
    if (product?.slug) {  // ✅ slug بدل id
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'view_product', productSlug: product.slug }) }).catch(() => {});
    }
  }, [product?.slug]);

  const handleOrder = (selection: { size: string; color: string; quantity: number }) => {
    setOrderSelection(selection);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
    setIsOrderModalOpen(false);
  };

  const allImages = [product.mainImage, ...product.subImages];
  const productUrl = `https://velix-eg.store/products/${product.slug}`;  // ✅ slug بدل id
  
  const categoryName = product.category === 'تيشرتات' ? 'تيشرتات' 
    : product.category === 'هوديز' ? 'هوديز' 
    : product.category === 'شروال' ? 'شروال' 
    : product.category === 'جينز' ? 'جينز'
    : product.category === 'جواكت' ? 'جواكت'
    : product.category === 'شوزات' ? 'شوزات'
    : product.category === 'اكسسوارات' ? 'اكسسوارات'
    : product.category;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductSchema(product, productUrl)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(product, categoryName)) }} />
      
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumb - نحاسي فخم */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>الرئيسية</span>
            </Link>
            <svg className="w-3 h-3 text-rose-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <span>المنتجات</span>
            </Link>
            <svg className="w-3 h-3 text-rose-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full transition-all duration-300 text-sm font-bold shadow-md hover:scale-105">
              <span>{product.category}</span>
            </Link>
            <svg className="w-3 h-3 text-rose-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full text-sm font-bold shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="truncate max-w-36 sm:max-w-48">{product.name}</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <ProductImages images={allImages} productName={product} stock={getTotalStock(product)} />
            <div>
              <ProductInfo product={product} />
              <ProductActions product={product} onOrder={handleOrder} />
            </div>
          </div>

          <RelatedProducts products={relatedProducts} currentProductId={product.id} />
        </div>
      </div>

      <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            mainImage: product.mainImage,
            quantity: orderSelection.quantity,
          }}
          onSubmit={handleOrderSubmit}
        />
    </>
  );
}
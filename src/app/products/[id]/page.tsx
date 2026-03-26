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

export const dynamic = 'force-dynamic';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSelection, setOrderSelection] = useState({ size: '', color: '', quantity: 1 });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const allProducts = await getProducts();
      const found = allProducts.find(p => p.id === parseInt(params.id as string));
      setProduct(found);
      
      if (found) {
        // منتجات ذات صلة: من نفس القسم واستبعاد المنتج الحالي
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

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-2xl animate-pulse h-100 md:h-125" />
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
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
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

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* قسم الصور */}
            <ProductImages images={allImages} productName={product.name} stock={stock} />

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
// app/products/[id]/metadata.ts
import { Metadata } from 'next';

interface ProductMetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateProductMetadata({ params }: ProductMetadataProps): Promise<Metadata> {
  // ✅ انتظر الـ params قبل استخدامها
  const { id } = await params;
  
  const { getProducts } = await import('@/lib/products');
  const products = await getProducts();
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return {
      title: "المنتج غير موجود | VELIX",
      description: "عذراً، المنتج الذي تبحث عنه غير متوفر في متجر VELIX",
    };
  }
  
  return {
    title: `${product.name} | VELIX - براند ملابس مصري`,
    description: product.description?.substring(0, 160) || "اكتشف هذا المنتج المميز من VELIX. جودة عالية وتصميم عصري. تسوق الآن وادفع عند الاستلام.",
    keywords: `${product.name}, تيشرت رجالي, هودي مصر, VELIX, ${product.category}, ملابس مصرية`,
    authors: [{ name: "VELIX", url: "https://velix-eg.store" }],
    creator: "VELIX",
    publisher: "VELIX",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": 200,
      },
    },
    openGraph: {
      title: `${product.name} | VELIX`,
      description: product.description?.substring(0, 160),
      url: `https://velix-eg.store/products/${id}`,
      siteName: "VELIX",
      locale: "ar_EG",
      type: "website",
      images: [
        {
          url: product.mainImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | VELIX`,
      description: product.description?.substring(0, 160),
      images: [product.mainImage],
    },
    alternates: {
      canonical: `https://velix-eg.store/products/${id}`,
    },
    category: "clothing",
  };
}
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { posts } from './blog/posts-data';

// ✅ أجبر الـ sitemap يتولد ديناميكياً عند كل طلب
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const INDEXNOW_KEY = '9efd03914b95463a8d249d6968ecda2a';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://velix-eg.store';

  // Ping IndexNow to notify Bing of content changes
  try {
    fetch(`https://www.bing.com/indexnow?url=${baseUrl}/sitemap.xml&key=${INDEXNOW_KEY}`, { method: 'GET' });
    fetch(`https://api.indexnow.org/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host: 'velix-eg.store', key: INDEXNOW_KEY, keyLocation: `https://velix-eg.store/${INDEXNOW_KEY}.txt`, urlList: [baseUrl, `${baseUrl}/sitemap.xml`] }),
    });
  } catch {} // fire-and-forget
  
  // ============================================
  // 1. الصفحات الثابتة
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/loyalty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gifts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // ============================================
  // 2. صفحات المنتجات (من API) - ✅ باستخدام slug
  // ============================================
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    if (products && products.length > 0) {
      productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,  // ✅ slug بدل id
        lastModified: new Date(product.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }
  
  // ============================================
  // 3. صفحات التصنيفات (Collections)
  // ============================================
  const collectionSlugs = ['tshirts', 'hoodies', 'pants', 'jeans', 'jackets', 'shoes', 'accessories'];
  const collectionPages: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url: `${baseUrl}/collections/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  
  // ============================================
  // 4. صفحات مقالات المدونة (من posts-data)
  // ============================================
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    if (posts && posts.length > 0) {
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }
  
  // ============================================
  // 5. دمج كل الصفحات
  // ============================================
  return [...staticPages, ...productPages, ...collectionPages, ...blogPages];
}
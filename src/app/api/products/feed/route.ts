import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL!);
const PRODUCTS_KEY = 'products';

async function getProducts() {
  try {
    const data = await redis.get(PRODUCTS_KEY);
    if (!data) return [];
    let products = JSON.parse(data);
    return products.map((p: any) => ({
      ...p,
      slug: p.slug || p.name.toLowerCase().replace(/[^\w\u0600-\u06FF\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      stockItems: p.stockItems || [],
    }));
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return [];
  }
}

function getTotalStock(product: any): number {
  if (product.stockItems && product.stockItems.length > 0) {
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const products = await getProducts();
  const baseUrl = 'https://velix-eg.store';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>VELIX - براند ملابس مصري</title>
    <link>${baseUrl}</link>
    <description>منتجات VELIX - ملابس مصرية فاخرة بجودة عالمية</description>
`;

  for (const product of products) {
    const stock = getTotalStock(product);
    const availability = stock > 0 ? 'in_stock' : 'out_of_stock';
    const price = product.price.toFixed(2);
    const image = product.mainImage || `${baseUrl}/images/og-image.png`;

    xml += `    <item>
      <g:id>VELIX-${escapeXml(product.slug)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description?.substring(0, 5000) || '')}</g:description>
      <g:link>${baseUrl}/products/${escapeXml(product.slug)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:price>${price} EGP</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>VELIX</g:brand>
      <g:condition>new</g:condition>
      <g:shipping>
        <g:country>EG</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EGP</g:price>
      </g:shipping>
      <g:product_type>${escapeXml(product.category || 'ملابس')}</g:product_type>
      <g:google_product_category>212</g:google_product_category>
    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex',
    },
  });
}

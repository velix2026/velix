'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // لو في الصفحة الرئيسية، متظهرش
  if (pathname === '/') return null;
  
  // نقسم الرابط إلى أجزاء
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // نرجع الأجزاء مع روابطها
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    
    // تحويل اسم الصفحة لاسم عربي
    let name = segment;
    switch (segment) {
      case 'products': name = 'المنتجات'; break;
      case 'about': name = 'عن البراند'; break;
      case 'contact': name = 'اتصل بنا'; break;
      case 'shipping': name = 'الشحن'; break;
      case 'returns': name = 'الاستبدال والاسترجاع'; break;
      case 'privacy': name = 'سياسة الخصوصية'; break;
      case 'terms': name = 'شروط الاستخدام'; break;
      default: name = decodeURIComponent(segment);
    }
    
    return { url, name, isLast };
  });
  
  // JSON-LD للـ Breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://velix-eg.store${item.url}`
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="container mx-auto px-4 py-3 mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link href="/" className="text-black/60 hover:text-black font-bold transition">
              الرئيسية
            </Link>
          </li>
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-black/30">/</span>
              {item.isLast ? (
                <span className="text-black font-black">{item.name}</span>
              ) : (
                <Link href={item.url} className="text-black/60 hover:text-black font-bold transition">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
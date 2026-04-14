'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // لو في الصفحة الرئيسية أو الأدمن، متعرضش حاجة خالص
  if (pathname === '/') return null;
  if (pathname.startsWith('/admin')) return null;
  
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    
    let name = segment;
    switch (segment) {
      case 'products': name = 'المنتجات'; break;
      case 'about': name = 'عن البراند'; break;
      case 'contact': name = 'اتصل بنا'; break;
      case 'shipping': name = 'الشحن'; break;
      case 'returns': name = 'الاستبدال والاسترجاع'; break;
      case 'privacy': name = 'سياسة الخصوصية'; break;
      case 'terms': name = 'شروط الاستخدام'; break;
      case 'favorites': name = 'المفضلة'; break;
      case 'cart': name = 'سلة التسوق'; break;
      default: name = decodeURIComponent(segment);
    }
    
    return { url, name, isLast };
  });
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://velix-eg.store/"
      },
      ...breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `https://velix-eg.store${item.url}`
      }))
    ]
  };
  
  return (
    <>
      {/* JSON-LD لجوجل بس - مش بيظهر للمستخدم */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Breadcrumbs مخفي تماماً عن المستخدم - موجود لجوجل بس */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">الرئيسية</Link>
          </li>
          {breadcrumbs.map((item, index) => (
            <li key={index}>
              <span>/</span>
              {item.isLast ? (
                <span>{item.name}</span>
              ) : (
                <Link href={item.url}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
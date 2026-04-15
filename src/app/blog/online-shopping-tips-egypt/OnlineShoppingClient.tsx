// app/blog/نصائح-للتسوق-اونلاين-في-مصر/OnlineShoppingClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function OnlineShoppingClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "نصائح التسوق أونلاين في مصر";
    const text = "ازاي تشتري من النت من غير وجع دماغ - دليل كامل من VELIX";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (err) {
        console.log('تم إلغاء المشاركة');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('✅ تم نسخ الرابط! شاركه مع صحابك 📋');
    }
  };

  const content = `
    <div class="space-y-8">
      
      <!-- مقدمة -->
      <div class="bg-rose-gold/5 rounded-2xl p-6 border border-rose-gold/20">
        <p class="text-lg font-bold text-black/80 leading-relaxed">"كتير من الناس لسه خايفة تشتري أونلاين. خايفة من النصب، خايفة من المقاس، خايفة من الجودة."</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هقولك <strong class="text-rose-gold">ازاي تشتري أونلاين في مصر من غير وجع دماغ</strong>. هتعرف ازاي تتأكد من الموقع، ازاي تختار المقاس، وايه حقوقك كعميل. بعد المقال ده، هتشتري أونلاين بثقة 100%!</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#trust" class="text-rose-gold hover:underline">١. اتأكد إن الموقع موثوق</a></li>
          <li><a href="#quality" class="text-rose-gold hover:underline">٢. ازاي تتأكد من جودة المنتج</a></li>
          <li><a href="#size" class="text-rose-gold hover:underline">٣. ازاي تختار المقاس الصح أونلاين</a></li>
          <li><a href="#payment" class="text-rose-gold hover:underline">٤. الدفع: كاش ولا كريديت كارد؟</a></li>
          <li><a href="#rights" class="text-rose-gold hover:underline">٥. الحقوق بتاعتك كعميل</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٦. أخطاء شائعة في التسوق أونلاين</a></li>
        </ul>
      </div>

      <!-- 1. اتأكد إن الموقع موثوق -->
      <div id="trust">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">اتأكد إن الموقع موثوق</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> شوف التقييمات على فيسبوك وجوجل</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> اتأكد إن فيه صفحة "اتصل بنا" ووسائل تواصل حقيقية</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> اقرأ سياسة الاستبدال والاسترجاع (لو مش مكتوبة، ابعد)</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> شوف عنوان الشركة (لو في عنوان حقيقي، ده مؤشر كويس)</div>
        </div>
      </div>

      <!-- 2. ازاي تتأكد من جودة المنتج -->
      <div id="quality">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تتأكد من جودة المنتج</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اقرأ وصف المنتج كويس (الخامة، المقاسات، الألوان)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اتفرج على صور المنتج من كل الزوايا</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> لو فيه فيديو للمنتج، اتفرج عليه</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اقرأ تقييمات العملاء اللي اشتروا قبلك (خصوصاً اللي فيها صور)</div>
        </div>
      </div>

      <!-- 3. ازاي تختار المقاس الصح أونلاين -->
      <div id="size">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تختار المقاس الصح أونلاين</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> قيس نفسك قبل ما تطلب (محيط الصدر، طول الجسم)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> قارن مقاساتك بجدول المقاسات بتاع الموقع</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> لو مش متأكد بين مقاسين، خد الأكبر (تقدر تستبدل بعدين)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اسأل خدمة العملاء</div>
        </div>
      </div>

      <!-- 4. الدفع -->
      <div id="payment">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">الدفع: كاش ولا كريديت كارد؟</h2></div>
        <div class="grid md:grid-cols-3 gap-3">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">💰</div><p class="font-black text-black">الدفع عند الاستلام</p><p class="text-sm">الأفضل للمبتدئين، مش هتدفع غير لما تتأكد من المنتج</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">💳</div><p class="font-black text-black">بطاقة ائتمانية</p><p class="text-sm">أسرع، بس اتأكد إن الموقع مشفر (قفل جنب اللينك)</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">🏦</div><p class="font-black text-black">تحويل بنكي</p><p class="text-sm">خد بالك، اشتري من مواقع معروفة بس</p></div>
        </div>
      </div>

      <!-- 5. الحقوق بتاعتك كعميل -->
      <div id="rights">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">الحقوق بتاعتك كعميل</h2></div>
        <div class="bg-green-50 rounded-xl p-4 border border-green-200">
          <div class="grid md:grid-cols-2 gap-2">
            <div class="flex items-center gap-2"><span class="text-green-600">✓</span> حقك تستبدل المنتج (١٤ يوم)</div>
            <div class="flex items-center gap-2"><span class="text-green-600">✓</span> حقك تعرف تفاصيل المنتج</div>
            <div class="flex items-center gap-2"><span class="text-green-600">✓</span> حقك تلغي الطلب قبل الشحن</div>
            <div class="flex items-center gap-2"><span class="text-green-600">✓</span> حقك تشتكي لجهاز حماية المستهلك</div>
          </div>
        </div>
      </div>

      <!-- 6. أخطاء شائعة -->
      <div id="mistakes">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">أخطاء شائعة في التسوق أونلاين (اتجنبها!)</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> متقراش سياسة الاستبدال - وبتتفاجأ إن مفيش استبدال</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> تنسى تقيس نفسك - وبتطلب مقاس غلط</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> تندفع ورا العروض الخيالية - لو العرض أحلامي، غالباً نصب</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> متاخدش بالك من رسوم الشحن</div>
        </div>
      </div>

    </div>
  `

  if (!mounted) {
    return (
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          <Link href="/" className="text-black/40 hover:text-rose-gold">الرئيسية</Link>
          <span className="text-black/30">/</span>
          <Link href="/blog" className="text-black/40 hover:text-rose-gold">المدونة</Link>
          <span className="text-black/30">/</span>
          <span className="text-rose-gold font-bold">نصائح التسوق أونلاين</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🛒 تسوق</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 7 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            نصائح التسوق أونلاين في مصر - ازاي تشتري من النت من غير وجع دماغ
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-rose-gold font-black text-xl mb-3">في VELIX، التسوق أونلاين أسهل وأضمن</p>
          <p className="text-black/70 font-bold mb-6">دفع عند الاستلام، استبدال مجاني خلال ١٤ يوم، وتوصيل لكل مصر. جرب واطمن.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق دلوقتي من VELIX
          </Link>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-6 border-t border-rose-gold/20 text-center">
          <p className="text-sm text-black/60 mb-3">شارك المقال مع صحابك:</p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43z"/>
            </svg>
            مشاركة
          </button>
          <p className="text-xs text-black/40 mt-2">↳ هتفتح قائمة المشاركة، اختار واتساب أو فيسبوك أو أي تطبيق</p>
        </div>
      </div>
    </div>
  );
}
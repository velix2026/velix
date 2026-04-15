// app/blog/دليل-المقاسات-للهوديز/HoodieSizeGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HoodieSizeGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "دليل المقاسات الكامل للهوديز";
    const text = "ازاي تختار المقاس الصح للهودي - دليل كامل من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"الهودي بقى من القطع الأساسية في لبس الشباب المصري. في الشتاء والصيف، في البيت وفي الخروجات، الهودي موجود في كل مكان."</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">لكن ازاي تختار <strong class="text-rose-gold">المقاس المناسب</strong> عشان تبقى شيك ومريح في نفس الوقت؟ في المقال ده، هتعرف كل حاجة عن مقاسات الهوديز.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#difference" class="text-rose-gold hover:underline">١. الفرق بين مقاسات الهودي والتيشرت</a></li>
          <li><a href="#measure" class="text-rose-gold hover:underline">٢. ازاي تقيس نفسك للهودي</a></li>
          <li><a href="#choose" class="text-rose-gold hover:underline">٣. إزاي تختار المقاس المناسب</a></li>
          <li><a href="#size-table" class="text-rose-gold hover:underline">٤. جدول مقاسات الهوديز</a></li>
          <li><a href="#fabric" class="text-rose-gold hover:underline">٥. أنواع الهوديز حسب الخامة</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٦. أخطاء شائعة في شراء الهوديز</a></li>
        </ul>
      </div>

      <!-- 1. الفرق بين مقاسات الهودي والتيشرت -->
      <div id="difference">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📏</span>
          ١. الفرق بين مقاسات الهودي والتيشرت
        </h2>
        <div class="bg-rose-gold/5 rounded-xl p-5 border border-rose-gold/20">
          <p class="font-black text-black text-lg mb-2">الهوديز بتكون <strong class="text-rose-gold">أكبر من التيشرتات بنفس المقاس</strong> بحوالي ٢-٣ سم في محيط الصدر.</p>
          <p class="text-black/70 font-bold">ده عشان الهودي معمول عشان يكون <strong class="text-rose-gold">مريح وفيه مساحة للطبقات التحتية</strong> (تيشرت من جوة، هودي من برة).</p>
        </div>
      </div>

      <!-- 2. ازاي تقيس نفسك للهودي -->
      <div id="measure">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📏</span>
          ٢. ازاي تقيس نفسك للهودي
        </h2>
        <p class="text-black/70 font-bold mb-4">نفس قياسات التيشرت بالضبط، بس مع إضافة طول الدراع:</p>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">📐</div><p class="font-black text-black">محيط الصدر</p><p class="text-xs text-black/60">لف الشريط حوالين أعرض جزء في صدرك</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">📏</div><p class="font-black text-black">طول الجسم</p><p class="text-xs text-black/60">من أعلى كتفك لحد المكان اللي عايز الهودي يوصل له</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">💪</div><p class="font-black text-black">طول الدراع</p><p class="text-xs text-black/60">من طرف كتفك لحد معصمك</p></div>
        </div>
      </div>

      <!-- 3. إزاي تختار المقاس المناسب -->
      <div id="choose">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">✅</span>
          ٣. إزاي تختار المقاس المناسب
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">لو عايز هودي مريح (للبيت أو الخروجات العادية)</strong><p class="text-sm">خد نفس مقاس التيشرت بتاعك</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">لو عايز هودي أوفر سايز (الموضة دلوقتي)</strong><p class="text-sm">خد مقاس أكبر بدرجة من مقاسك الطبيعي</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">لو عايز هودي تحت جاكيت</strong><p class="text-sm">خد مقاس أصغر بدرجة عشان ميكنش تقيل عليك</p></div></div>
        </div>
      </div>

      <!-- 4. جدول مقاسات الهوديز -->
      <div id="size-table">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📊</span>
          ٤. جدول مقاسات الهوديز
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-rose-gold/10">
                <th class="border border-rose-gold/20 p-3 text-center font-black">المقاس</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">العربي</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">الصدر (سم)</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">الطول (سم)</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">الوزن (كجم)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border p-3 text-center font-bold">S</td><td class="border p-3 text-center">صغير</td><td class="border p-3 text-center">94-98</td><td class="border p-3 text-center">64-66</td><td class="border p-3 text-center">55-65</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">M</td><td class="border p-3 text-center">وسط</td><td class="border p-3 text-center">98-102</td><td class="border p-3 text-center">66-68</td><td class="border p-3 text-center">65-75</td></tr>
              <tr><td class="border p-3 text-center font-bold">L</td><td class="border p-3 text-center">كبير</td><td class="border p-3 text-center">102-106</td><td class="border p-3 text-center">68-70</td><td class="border p-3 text-center">75-85</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">XL</td><td class="border p-3 text-center">كبير جداً</td><td class="border p-3 text-center">106-110</td><td class="border p-3 text-center">70-72</td><td class="border p-3 text-center">85-95</td></tr>
              <tr><td class="border p-3 text-center font-bold">2XL</td><td class="border p-3 text-center">كبير جداً 2</td><td class="border p-3 text-center">110-114</td><td class="border p-3 text-center">72-74</td><td class="border p-3 text-center">95-110</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">3XL</td><td class="border p-3 text-center">كبير جداً 3</td><td class="border p-3 text-center">114-118</td><td class="border p-3 text-center">74-76</td><td class="border p-3 text-center">110-125</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-black/40 text-center mt-2">* الجدول تقريبي وقد يختلف حسب الماركة ونوع الخامة</p>
      </div>

      <!-- 5. أنواع الهوديز حسب الخامة -->
      <div id="fabric">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🧥</span>
          ٥. أنواع الهوديز حسب الخامة
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">🍃</div><p class="font-black text-black">French Terry</p><p class="text-sm text-black/60">خفيف، مناسب للصيف والخريف، بيتهوى ومش بيسخن</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">🔥</div><p class="font-black text-black">Brushed Cotton</p><p class="text-sm text-black/60">تقيل، مناسب للشتوية القاسية، بيدفى جداً ومريح</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-3xl mb-2">🔄</div><p class="font-black text-black">Cotton Blend</p><p class="text-sm text-black/60">وسط، مناسب للخريف والشتاء المعتدل</p></div>
        </div>
      </div>

      <!-- 6. أخطاء شائعة -->
      <div id="mistakes">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">⚠️</span>
          ٦. أخطاء شائعة في شراء الهوديز (اتجنبها!)
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تخد مقاس صغير عشان يبقى "شيك"</strong><p class="text-sm">الهودي الضيق مش مريح وهتحس إنك مقيد طول اليوم</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تنسى إن الهودي هيتقل بعد الغسيل</strong><p class="text-sm">خد مقاس أكبر بشوية لو كنت هتغسله في الماية السخنة</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">متجربش الهودي قبل ما تشتريه</strong><p class="text-sm">لو بتشتري أونلاين، اتأكد من سياسة الاستبدال</p></div></div>
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
          <span className="text-rose-gold font-bold">دليل مقاسات الهوديز</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">📏 دليل مقاسات</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 6 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            دليل المقاسات الكامل للهوديز - ازاي تختار المقاس الصح
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🔥</div>
          <p className="text-rose-gold font-black text-xl mb-3">عروض VELIX على الهوديز</p>
          <p className="text-black/70 font-bold mb-6">هوديز شتوية تقيلة وخامات صيفية خفيفة. كل المقاسات من S لـ 3XL. شحن مجاني لكل مصر.</p>
          <Link 
            href="/products?category=هوديز" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق الهوديز دلوقتي
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
// app/blog/انواع-الأقمشة-ودليل-اختيارها/FabricTypesClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function FabricTypesClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "أنواع الأقمشة الكامل";
    const text = "دليل اختيار القماش المناسب لكل فصل - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"مش كل الأقمشة زي بعض. اختيار القماش المناسب بيفرق في الراحة وفي الشكل وفي عمر المنتج."</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هنتكلم عن <strong class="text-rose-gold">كل أنواع الأقمشة</strong>: مميزاتها وعيوبها، وإمتى تختار كل نوع. بعد المقال ده، هتبقى خبير في اختيار الأقمشة!</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#cotton" class="text-rose-gold hover:underline">١. القطن (Cotton)</a></li>
          <li><a href="#polyester" class="text-rose-gold hover:underline">٢. البوليستر (Polyester)</a></li>
          <li><a href="#blend" class="text-rose-gold hover:underline">٣. القطن بوليستر (Blend)</a></li>
          <li><a href="#wool" class="text-rose-gold hover:underline">٤. الصوف (Wool)</a></li>
          <li><a href="#denim" class="text-rose-gold hover:underline">٥. الدنيم (Denim)</a></li>
          <li><a href="#french-terry" class="text-rose-gold hover:underline">٦. الـ French Terry</a></li>
          <li><a href="#brushed-cotton" class="text-rose-gold hover:underline">٧. الـ Brushed Cotton</a></li>
          <li><a href="#season" class="text-rose-gold hover:underline">٨. ازاي تختار القماش حسب الفصل</a></li>
          <li><a href="#real-vs-fake" class="text-rose-gold hover:underline">٩. ازاي تعرف القماش الأصلي من التقليد</a></li>
        </ul>
      </div>

      <!-- 1. القطن -->
      <div id="cotton">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🌿</span>
          ١. القطن (Cotton)
        </h2>
        <p class="text-black/70 font-bold mb-3">القطن هو القماش الأكتر استخداماً في العالم، وخصوصاً في مصر.</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>ناعم على الجلد</li><li>بيدخل هوا (مش بيسخن)</li><li>بيمتص العرق</li><li>سهل الغسيل</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>بيتجعد بسرعة</li><li>ممكن يتقلص لو اتغسل في ماية سخنة</li></ul></div>
        </div>
        <div class="bg-rose-gold/5 rounded-xl p-4 mt-3 border border-rose-gold/20">
          <p class="font-black text-black">📌 الاستخدام: التيشرتات، البيجامات، الملابس الداخلية، المفروشات</p>
          <p class="font-black text-black mt-2">🏷️ أنواع القطن: قطن مصري (فاخر)، قطن أمريكي (جيد)، قطن عادي (اقتصادي)</p>
        </div>
      </div>

      <!-- 2. البوليستر -->
      <div id="polyester">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🧪</span>
          ٢. البوليستر (Polyester)
        </h2>
        <p class="text-black/70 font-bold mb-3">قماش صناعي ١٠٠٪، مش طبيعي.</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>متين جداً (مش بيتقطع بسرعة)</li><li>بيتجعد قليل</li><li>بيجف بسرعة</li><li>سعره رخيص</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>مش بيدخل هوا (بيسخن في الصيف)</li><li>ممكن يسبب حساسية</li><li>بيحبس العرق</li></ul></div>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 mt-3 border border-amber-200">
          <p class="text-amber-700 font-bold text-sm flex items-center gap-2">💡 <span>معلومة: البوليستر ممتاز للملابس الرياضية لأنه بيطرد العرق للخارج بدل ما يمتصه زي القطن. لكن في الصيف العادي، القطن أفضل بكتير.</span></p>
        </div>
      </div>

      <!-- 3. القطن بوليستر -->
      <div id="blend">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔄</span>
          ٣. القطن بوليستر (Cotton-Polyester Blend)
        </h2>
        <p class="text-black/70 font-bold mb-3">خليط بين القطن الطبيعي والبوليستر الصناعي.</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>نعومة القطن + متانة البوليستر</li><li>بيتجعد أقل من القطن ١٠٠٪</li><li>سعره في النص</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>مش ناعم زي القطن ١٠٠٪</li><li>مش بيدخل هوا زي القطن</li></ul></div>
        </div>
      </div>

      <!-- 4. الصوف -->
      <div id="wool">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🐑</span>
          ٤. الصوف (Wool)
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>بيدفى جداً</li><li>بيدخل هوا</li><li>مش بيتجعد</li><li>مقاوم للحريق</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>غالي</li><li>محتاج عناية خاصة (غسيل جاف)</li><li>ممكن يخدش الجلد الحساس</li></ul></div>
        </div>
      </div>

      <!-- 5. الدنيم -->
      <div id="denim">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">👖</span>
          ٥. الدنيم (Denim)
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>متين جداً</li><li>شكله حلو وعملي</li><li>بيعيش سنين</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>تقيل شوية</li><li>مش بيدخل هوا في الصيف</li><li>بيحتاج وقت عشان ينشف</li></ul></div>
        </div>
      </div>

      <!-- 6. French Terry -->
      <div id="french-terry">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🧥</span>
          ٦. الـ French Terry
        </h2>
        <p class="text-black/70 font-bold mb-3">قماش القطيفة الخفيفة، اللي بيتعمل منه الهوديز الخفيفة.</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>ناعم جداً من جوة</li><li>خفيف ومريح</li><li>بيدخل هوا</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>مش دافي كفاية للشتاء القاسي</li></ul></div>
        </div>
      </div>

      <!-- 7. Brushed Cotton -->
      <div id="brushed-cotton">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔥</span>
          ٧. الـ Brushed Cotton (قطن مبشور)
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">✓ المميزات</p><ul class="space-y-1 text-sm"><li>دافي جداً</li><li>ناعم على الجلد</li><li>مش بيخدش</li></ul></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">✗ العيوب</p><ul class="space-y-1 text-sm"><li>تقيل شوية</li><li>ممكن يتكوم مع الوقت</li></ul></div>
        </div>
      </div>

      <!-- 8. اختيار القماش حسب الفصل -->
      <div id="season">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📅</span>
          ٨. ازاي تختار القماش حسب الفصل
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <div class="flex items-center gap-2 mb-3"><span class="text-3xl">☀️</span><p class="font-black text-amber-700 text-lg">للصيف</p></div>
            <ul class="space-y-2">
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">قطن ١٠٠٪</strong> <span class="text-sm text-black/60">(الأفضل)</span></li>
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">كتان</strong> <span class="text-sm text-black/60">(مثالي للحر)</span></li>
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">French Terry</strong> <span class="text-sm text-black/60">(للأجواء المعتدلة)</span></li>
              <li class="flex items-center gap-2"><span class="text-red-500 text-xl">✗</span> <strong class="font-black">بوليستر</strong> <span class="text-sm text-black/60">(بيسخن جداً)</span></li>
              <li class="flex items-center gap-2"><span class="text-red-500 text-xl">✗</span> <strong class="font-black">صوف</strong> <span class="text-sm text-black/60">(حر)</span></li>
            </ul>
          </div>
          <div class="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div class="flex items-center gap-2 mb-3"><span class="text-3xl">❄️</span><p class="font-black text-blue-700 text-lg">للشتاء</p></div>
            <ul class="space-y-2">
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">Brushed Cotton</strong> <span class="text-sm text-black/60">(دافي جداً)</span></li>
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">صوف</strong> <span class="text-sm text-black/60">(لأبرد الأيام)</span></li>
              <li class="flex items-center gap-2"><span class="text-green-600 text-xl">✓</span> <strong class="font-black">French Terry تقيل</strong></li>
              <li class="flex items-center gap-2"><span class="text-red-500 text-xl">✗</span> <strong class="font-black">قطن خفيف</strong> <span class="text-sm text-black/60">(مش هيدفي)</span></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 9. ازاي تعرف القماش الأصلي -->
      <div id="real-vs-fake">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔍</span>
          ٩. ازاي تعرف القماش الأصلي من التقليد؟
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl border border-rose-gold/20"><span class="text-2xl">🔥</span><div><strong class="font-black">احرق خيط صغير</strong><p class="text-sm text-black/60">القطن الأصلي ريحته زي الورق المحروق والرماد بيتفتت. البوليستر ريحته بلاستيك وساعات بيتكور</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl border border-rose-gold/20"><span class="text-2xl">✋</span><div><strong class="font-black">حس بيه</strong><p class="text-sm text-black/60">القطن الأصلي ناعم وطبيعي. البوليستر ناعم بس "بلاستيكي" شوية</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl border border-rose-gold/20"><span class="text-2xl">🏷️</span><div><strong class="font-black">اقرأ البطاقة</strong><p class="text-sm text-black/60">البطاقة بتكتب النسبة المئوية لكل قماش. لو مكتوب "100% Cotton" يبقى قطن أصلي</p></div></div>
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
          <span className="text-rose-gold font-bold">أنواع الأقمشة</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🧵 خامات</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 10 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            أنواع الأقمشة الكامل - دليل اختيار القماش المناسب لكل فصل
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">👕</div>
          <p className="text-rose-gold font-black text-xl mb-3">في VELIX كل المنتجات قطن مصري ١٠٠٪</p>
          <p className="text-black/70 font-bold mb-6">مش خليط، مش بوليستر، قطن مصري أصلي. جرب بنفسك وهتحس بالفرق.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق القطن المصري دلوقتي
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
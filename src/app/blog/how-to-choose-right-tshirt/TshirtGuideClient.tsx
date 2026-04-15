// app/blog/ازاي-تختار-التيشرت-المناسب/TshirtGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TshirtGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تختار التيشرت المناسب ليك؟";
    const text = "دليل كامل لاختيار التيشرت المناسب - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"التيشرت هو القطعة الأساسية في أي دولاب. لكن ازاي تختار التيشرت اللي يخليك شيك ومريح في نفس الوقت؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هنتكلم عن <strong class="text-rose-gold">٦ حاجات</strong> لازم تركز عليها عشان تختار التيشرت المناسب ليك. بعد المقال ده، هتبقى خبير في شراء التيشرتات!</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#body-shape" class="text-rose-gold hover:underline">١. اعرف شكل جسمك أولاً</a></li>
          <li><a href="#size" class="text-rose-gold hover:underline">٢. اختار المقاس الصح</a></li>
          <li><a href="#fabric" class="text-rose-gold hover:underline">٣. خلي بالك من الخامة</a></li>
          <li><a href="#color" class="text-rose-gold hover:underline">٤. اختار اللون المناسب لبشرتك</a></li>
          <li><a href="#occasion" class="text-rose-gold hover:underline">٥. التيشرت حسب المناسبة</a></li>
          <li><a href="#tips" class="text-rose-gold hover:underline">٦. نصائح إضافية عشان تبقى شيك دايماً</a></li>
        </ul>
      </div>

      <!-- 1. شكل الجسم -->
      <div id="body-shape">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">اعرف شكل جسمك أولاً</h2></div>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-4xl mb-2">🧍‍♂️</div><p class="font-black text-black">الجسم النحيف</p><p class="text-sm text-black/60">التيشرتات الـ <strong class="text-rose-gold">Slim Fit</strong> هتبان عليك حلوة جداً. بتدي شكلك أنحف وأطول.</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-4xl mb-2">💪</div><p class="font-black text-black">الجسم المتوسط</p><p class="text-sm text-black/60">الـ <strong class="text-rose-gold">Regular Fit</strong> هيكون أحسن حاجة. مش ضيق أوي ومش واسع أوي.</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center"><div class="text-4xl mb-2">🏋️</div><p class="font-black text-black">الجسم الممتلئ</p><p class="text-sm text-black/60">الـ <strong class="text-rose-gold">Oversize</strong> هيديك شكل أنيق ويخفي العيوب.</p></div>
        </div>
      </div>

      <!-- 2. المقاس الصح -->
      <div id="size">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">اختار المقاس الصح</h2></div>
        <p class="text-black/70 font-bold mb-3">المقاس المناسب هو اللي:</p>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span> الكتفين يبقوا مظبوطين - الدرز تكون على طرف كتفك بالضبط</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span> الطول يكون مناسب - يوصل لنص بنطلونك أو شوية أقل</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span> الدراع يكون مش ضيق ولا واسع أوي - يكون فيه مساحة للحركة</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span> التيشرت يكون قريب من جسمك لكن مش لاصق فيه</div>
        </div>
      </div>

      <!-- 3. الخامة -->
      <div id="fabric">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">خلي بالك من الخامة</h2></div>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-3xl mb-2">🌿</div><p class="font-black text-black">قطن ١٠٠٪</p><p class="text-sm">أفضل حاجة في الصيف. بيدخل هوا ومش بيخليك تعرق.</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-3xl mb-2">🏃</div><p class="font-black text-black">قطن بوليستر</p><p class="text-sm">مناسب للرياضة بس مش مريح في الحر.</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-3xl mb-2">🇪🇬</div><p class="font-black text-black">القطن المصري</p><p class="text-sm">أحسن أنواع القطن. ناعم جداً وعمره طويل.</p></div>
        </div>
      </div>

      <!-- 4. اللون المناسب للبشرة -->
      <div id="color">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">اختار اللون المناسب لبشرتك</h2></div>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-amber-50 rounded-xl p-4 border border-amber-200"><p class="font-black text-amber-700 mb-2">🟤 للبشرة الحنطية والسمرة</p><p class="text-sm">الألوان الفاتحة (أبيض، بيج، أزرق فاتح) والألوان الزاهية (أحمر، أصفر)</p></div>
          <div class="bg-amber-50 rounded-xl p-4 border border-amber-200"><p class="font-black text-amber-700 mb-2">⚪ للبشرة البيضاء</p><p class="text-sm">الألوان الداكنة (أسود، كحلي، أخضر عسكري) والألوان الباردة (رمادي، أزرق سماوي)</p></div>
          <div class="bg-amber-50 rounded-xl p-4 border border-amber-200"><p class="font-black text-amber-700 mb-2">🟡 للبشرة القمحية</p><p class="text-sm">كل الألوان بتناسبك تقريباً. بس خلي بالك من الأصفر الفاقع.</p></div>
        </div>
      </div>

      <!-- 5. التيشرت حسب المناسبة -->
      <div id="occasion">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">التيشرت حسب المناسبة</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">😎</span><div><p class="font-black">للخروجات الكاجوال</p><p class="text-sm">التيشرتات السادة بالألوان المحايدة (أبيض، أسود، بيج، رمادي)</p></div></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">💼</span><div><p class="font-black">للشغل أو الكلية</p><p class="text-sm">التيشرتات الـ Polo أو الـ Basic اللي مش فيها رسومات صارخة</p></div></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">✨</span><div><p class="font-black">للسهرات والجو الفخم</p><p class="text-sm">التيشرتات الداكنة (أسود، كحلي) مع جاكيت أو بلوفر</p></div></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">🏋️</span><div><p class="font-black">للجيم والرياضة</p><p class="text-sm">التيشرتات الـ Sport مصنوعة من قطن بوليستر عشان تمتص العرق</p></div></div>
        </div>
      </div>

      <!-- 6. نصائح إضافية -->
      <div id="tips">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">نصائح إضافية عشان تبقى شيك دايماً</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold text-xl">✓</span> التيشرت الأبيض والأسود أساس أي دولاب - اتأكد إن عندك واحد على الأقل</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold text-xl">✓</span> التيشرت يكون نضيف ومكوي - التفاصيل الصغيرة بتفرق</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold text-xl">✓</span> متلبسش تيشرت فيه رسومات مع بنطلون فيه رسومات - خلي الهدوء في قطعة واحدة بس</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold text-xl">✓</span> التيشرت الضيق جداً أو الواسع جداً مش شيك - خليك في الوسط</div>
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
          <span className="text-rose-gold font-bold">ازاي تختار التيشرت المناسب</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">👕 نصائح</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 7 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تختار التيشرت المناسب ليك؟ دليل كامل
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">💡</div>
          <p className="text-rose-gold font-black text-xl mb-3">نصيحة من VELIX</p>
          <p className="text-black/70 font-bold mb-6">عندنا في VELIX تشكيلة متنوعة من التيشرتات بكل المقاسات والألوان. كل قطعة قطن مصري ١٠٠٪.</p>
          <Link 
            href="/products?category=تيشرتات" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق التيشرتات دلوقتي
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
// app/blog/ازاي-تختار-هدية-من-الملابس/GiftGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function GiftGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تختار هدية من الملابس لحد بتحبه؟";
    const text = "دليل كامل لاختيار هدية من الملابس لأي مناسبة - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"عايز تهدي حد هدية من الملابس ومش عارف تختار؟" "خايف تجيب مقاس غلط؟" "مش عارف اللون اللي يحبه؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">المقال ده هيديك <strong class="text-rose-gold">دليل كامل 100%</strong> عشان تختار الهدية المثالية من الملابس. هنقولك ازاي تعرف المقاس من غير ما تسأل، ازاي تختار اللون المناسب، وايه أفضل أفكار الهدايا لكل مناسبة.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#rule" class="text-rose-gold hover:underline">١. القاعدة الذهبية: اعرف الشخص كويس</a></li>
          <li><a href="#size" class="text-rose-gold hover:underline">٢. ازاي تعرف المقاس من غير ما تسأل؟</a></li>
          <li><a href="#ideas" class="text-rose-gold hover:underline">٣. أفكار هدايا من الملابس</a></li>
          <li><a href="#occasion" class="text-rose-gold hover:underline">٤. هدايا حسب المناسبة</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٥. أخطاء شائعة</a></li>
          <li><a href="#why" class="text-rose-gold hover:underline">٦. ليه تختار هدية من VELIX؟</a></li>
        </ul>
      </div>

      <!-- 1. القاعدة الذهبية -->
      <div id="rule">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🎯</span>
          ١. القاعدة الذهبية: اعرف الشخص كويس
        </h2>
        <p class="text-black/70 font-bold mb-4 leading-relaxed">قبل ما تشتري أي حاجة، فكر في الشخص اللي هتدي له. اسأل نفسك الأسئلة دي:</p>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black">👔 ستايله إيه؟</p><p class="text-sm text-black/60">بيحب الكاجوال ولا الرسمي؟ الأوفر سايز ولا الضيق؟</p></div>
          <div class="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black">🎨 ألوانه المفضلة؟</p><p class="text-sm text-black/60">بيحب الأسود والأبيض ولا الألوان الجريئة؟</p></div>
          <div class="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black">💼 بيشتغل إيه؟</p><p class="text-sm text-black/60">مكتبي ولا رياضي؟ الهدية تختلف حسب شغله</p></div>
          <div class="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black">💰 ميزانيتك كام؟</p><p class="text-sm text-black/60">مشتريش حاجة أغلى من مقدرتك، الأهم إنها من القلب</p></div>
        </div>
      </div>

      <!-- 2. ازاي تعرف المقاس -->
      <div id="size">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📏</span>
          ٢. ازاي تعرف المقاس من غير ما تسأل؟
        </h2>
        <div class="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-4">
          <p class="font-black text-amber-700 mb-2">💡 4 طرق عبقرية لمعرفة المقاس:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2"><span class="text-amber-700">✓</span> <strong>شوف هدومه اللي بيلبسها:</strong> لو عندك فرصة تشوف تيشرت أو هودي لابسه، بص على البطاقة وشوف المقاس</li>
            <li class="flex items-start gap-2"><span class="text-amber-700">✓</span> <strong>اسأل صاحبه أو أمه:</strong> هم غالباً هيعرفوا مقاسه بالظبط</li>
            <li class="flex items-start gap-2"><span class="text-amber-700">✓</span> <strong>خد مقاس L أو XL:</strong> أكتر مقاسين منتشرين عند الشباب المصري</li>
            <li class="flex items-start gap-2"><span class="text-amber-700">✓</span> <strong>اشتري هدية قابلة للاستبدال:</strong> في VELIX عندك ١٤ يوم تستبدل المنتج</li>
          </ul>
        </div>
      </div>

      <!-- 3. أفكار هدايا -->
      <div id="ideas">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🎁</span>
          ٣. أفكار هدايا من الملابس
        </h2>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-xl p-5 border border-rose-gold/20 shadow-sm"><div class="text-4xl mb-3">👕</div><h3 class="text-xl font-black text-black mb-2">التيشرت الأبيض أو الأسود</h3><p class="text-black/60">تيشرت قطن أبيض أو أسود عالي الجودة بيناسب أي حد.</p><Link href="/products?category=تيشرتات" class="inline-block mt-3 text-rose-gold text-sm font-bold hover:underline">تسوق التيشرتات →</Link></div>
          <div class="bg-white rounded-xl p-5 border border-rose-gold/20 shadow-sm"><div class="text-4xl mb-3">🧥</div><h3 class="text-xl font-black text-black mb-2">الهودي (Hoodie)</h3><p class="text-black/60">الهودي بقى من القطع الأساسية في لبس الشباب.</p><Link href="/products?category=هوديز" class="inline-block mt-3 text-rose-gold text-sm font-bold hover:underline">تسوق الهوديز →</Link></div>
          <div class="bg-white rounded-xl p-5 border border-rose-gold/20 shadow-sm"><div class="text-4xl mb-3">👖</div><h3 class="text-xl font-black text-black mb-2">الشروال الرياضي (Joggers)</h3><p class="text-black/60">مريح وعملي، بيناسب أي حد بيحب الراحة.</p><Link href="/products?category=شروال" class="inline-block mt-3 text-rose-gold text-sm font-bold hover:underline">تسوق الشروال →</Link></div>
          <div class="bg-white rounded-xl p-5 border border-rose-gold/20 shadow-sm"><div class="text-4xl mb-3">🧢</div><h3 class="text-xl font-black text-black mb-2">الطاقية أو الكاب</h3><p class="text-black/60">هدية بسيطة وسعرها مناسب، وبتنفع لأي مناسبة.</p></div>
        </div>
      </div>

      <!-- 4. هدايا حسب المناسبة -->
      <div id="occasion">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📅</span>
          ٤. هدايا حسب المناسبة
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead><tr class="bg-rose-gold/10"><th class="border p-3 text-center">المناسبة</th><th class="border p-3 text-center">الهدية المناسبة</th><th class="border p-3 text-center">لمن تناسب؟</th></tr></thead>
            <tbody>
              <tr><td class="border p-3 text-center">🎂 عيد ميلاد</td><td class="border p-3">تيشرت مطبوع بحاجة بيحبها</td><td class="border p-3">للأصدقاء المقربين</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center">🎓 التخرج</td><td class="border p-3">هودي عالي الجودة أو جاكيت</td><td class="border p-3">لأخوك أو صاحبك</td></tr>
              <tr><td class="border p-3 text-center">💍 الخطوبة/الجواز</td><td class="border p-3">رداء حمام فاخر، بيجامة حرير</td><td class="border p-3">للعريس أو العروسة</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center">🎄 رأس السنة</td><td class="border p-3">شروال رياضي، تيشرتات سادة</td><td class="border p-3">لأي حد</td></tr>
              <tr><td class="border p-3 text-center">🎁 مفاجأة</td><td class="border p-3">كاب، طاقية، جوارب جلد</td><td class="border p-3">لأي حد عشان تفرحه</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. أخطاء شائعة -->
      <div id="mistakes">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">⚠️</span>
          ٥. أخطاء شائعة (اتجنبها!)
        </h2>
        <ul class="space-y-2">
          <li>✗ تخد مقاس صغير عشان "يشجعه يخس" - دي أسوأ هدية</li>
          <li>✗ تشتري حاجة انت بتحبها مش هو - الهدية للشخص اللي هتدي له</li>
          <li>✗ تهمل الجودة عشان السعر - هدية رخيصة باينة أسوأ</li>
          <li>✗ تنسى كارت المعايدة - الكرت البسيط بيفرق في المشاعر</li>
        </ul>
      </div>

      <!-- 6. ليه VELIX -->
      <div id="why">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">✨</span>
          ٦. ليه تختار هدية من VELIX؟
        </h2>
        <div class="grid md:grid-cols-2 gap-3 mb-6">
          <div class="flex items-center gap-2 bg-white rounded-xl p-2 border border-rose-gold/20"><span>🇪🇬</span> قطن مصري ١٠٠٪</div>
          <div class="flex items-center gap-2 bg-white rounded-xl p-2 border border-rose-gold/20"><span>🎁</span> تغليف أنيق جاهز للهدية</div>
          <div class="flex items-center gap-2 bg-white rounded-xl p-2 border border-rose-gold/20"><span>🔄</span> استبدال مجاني خلال ١٤ يوم</div>
          <div class="flex items-center gap-2 bg-white rounded-xl p-2 border border-rose-gold/20"><span>🚚</span> توصيل مجاني لكل مصر</div>
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
          <span className="text-rose-gold font-bold">ازاي تختار هدية من الملابس</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🎁 هدايا</span>
            <span className="text-xs text-black/40">📅 12 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 8 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تختار هدية من الملابس لحد بتحبه؟
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section - ✅ خارج الـ content عشان الـ Link يشتغل */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🎁</div>
          <p className="text-rose-gold font-black text-xl mb-3">جهز هديتك من VELIX دلوقتي</p>
          <p className="text-black/70 font-bold mb-6">مع كل هدية، بنبعت كارت معايدة مجاني. اختار الهدية واحنا هنوصلها لباب بيت اللي بتحبه.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق دلوقتي واختار الهدية المناسبة
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
// app/blog/الفرق-بين-القطن-المصري-والقطن-العادي/EgyptianCottonClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function EgyptianCottonClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "الفرق بين القطن المصري والقطن العادي";
    const text = "ليه القطن المصري الأحسن؟ دليل كامل من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"القطن المصري مشهور في كل العالم، بس إيه الفرق بينه وبين القطن العادي؟" "ليه سعره أغلى؟" "يستاهل أدفع أكتر ولا لأ؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هتعرف <strong class="text-rose-gold">كل حاجة عن القطن المصري</strong>: الفرق بينه وبين القطن العادي، ازاي تفرق بين الأصلي والتقليد، وليه هو الأفضل في العالم. بعد المقال ده، هتبقى خبير في الأقمشة!</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#what-is" class="text-rose-gold hover:underline">١. إيه هو القطن المصري؟</a></li>
          <li><a href="#difference" class="text-rose-gold hover:underline">٢. الفرق بين القطن المصري والقطن العادي</a></li>
          <li><a href="#why-expensive" class="text-rose-gold hover:underline">٣. ليه القطن المصري غالي؟</a></li>
          <li><a href="#how-to-tell" class="text-rose-gold hover:underline">٤. ازاي تفرق بين الأصلي والتقليد؟</a></li>
          <li><a href="#why-choose" class="text-rose-gold hover:underline">٥. ليه تختار القطن المصري؟</a></li>
          <li><a href="#care" class="text-rose-gold hover:underline">٦. ازاي تعتني بالقطن المصري؟</a></li>
        </ul>
      </div>

      <!-- 1. إيه هو القطن المصري -->
      <div id="what-is">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🇪🇬</span>
          ١. إيه هو القطن المصري؟
        </h2>
        <p class="text-black/70 font-bold mb-4 leading-relaxed">القطن المصري هو قطن <strong class="text-rose-gold">طويل التيلة (Extra-Long Staple Cotton)</strong>. التيلة دي هي طول الشعرة الواحدة في القطن. القطن العادي تيلته قصيرة (بتاعة أمريكا أو الهند مثلاً).</p>
        <div class="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <p class="text-amber-700 font-bold text-sm flex items-center gap-2">🔬 <span>المعلومة العلمية: تيلة القطن المصري بتوصل لـ ٣٥-٤٠ ملم، بينما القطن العادي تيلته ٢٠-٢٥ ملم. الفرق ده بيغير كل حاجة في النعومة والمتانة.</span></p>
        </div>
      </div>

      <!-- 2. الفرق بين القطن المصري والقطن العادي -->
      <div id="difference">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📊</span>
          ٢. الفرق بين القطن المصري والقطن العادي
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-rose-gold/10">
                <th class="border border-rose-gold/20 p-3 text-center font-black">الميزة</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">القطن المصري</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">القطن العادي</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border p-3 font-bold">طول التيلة</td><td class="border p-3 bg-green-50">طويل جداً (٣٥-٤٠ ملم)</td><td class="border p-3 bg-red-50">قصير (٢٠-٢٥ ملم)</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 font-bold">النعومة</td><td class="border p-3 bg-green-50">ناعم جداً (مش بيحرق الجلد)</td><td class="border p-3 bg-red-50">خشن شوية (خصوصاً بعد الغسيل)</td></tr>
              <tr><td class="border p-3 font-bold">المتانة</td><td class="border p-3 bg-green-50">بتعيش لسنين (ألياف قوية)</td><td class="border p-3 bg-red-50">بتتآكل بسرعة</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 font-bold">التهوية</td><td class="border p-3 bg-green-50">فوق الممتازة (بيدخل هوا)</td><td class="border p-3 bg-red-50">متوسطة</td></tr>
              <tr><td class="border p-3 font-bold">التجاعيد</td><td class="border p-3 bg-green-50">بتتجعد أقل (بتفضل ناعمة)</td><td class="border p-3 bg-red-50">بتتجعد بسرعة</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 font-bold">الانكماش</td><td class="border p-3 bg-green-50">أقل انكماش بعد الغسيل</td><td class="border p-3 bg-red-50">ينكمش أكثر</td></tr>
              <tr><td class="border p-3 font-bold">امتصاص العرق</td><td class="border p-3 bg-green-50">بيمتص العرق بسرعة</td><td class="border p-3 bg-red-50">متوسط</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 font-bold">السعر</td><td class="border p-3 bg-amber-50">أعلى (لكنه بيستاهل)</td><td class="border p-3">أقل</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. ليه القطن المصري غالي؟ -->
      <div id="why-expensive">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">💰</span>
          ٣. ليه القطن المصري غالي؟
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">🏆</span><div><p class="font-black text-black">الجودة الأعلى في العالم</p><p class="text-sm text-black/60">القطن المصري معروف إنه أحسن قطن في العالم</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">📦</span><div><p class="font-black text-black">الإنتاج محدود</p><p class="text-sm text-black/60">مصر بتنتج كمية محدودة من القطن فائق الجودة</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">🌱</span><div><p class="font-black text-black">طويل التيلة</p><p class="text-sm text-black/60">زراعته أصعب وتكلفتها أعلى</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">✋</span><div><p class="font-black text-black">القطف باليد</p><p class="text-sm text-black/60">بيتقطف باليد عشان يحافظ على الألياف</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">👑</span><div><p class="font-black text-black">سمعة عالمية</p><p class="text-sm text-black/60">براندات عالمية زي Gucci و Louis Vuitton بتستخدمه</p></div></div>
        </div>
      </div>

      <!-- 4. ازاي تفرق بين الأصلي والتقليد -->
      <div id="how-to-tell">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔍</span>
          ٤. ازاي تفرق بين القطن المصري الأصلي والتقليد؟
        </h2>
        <div class="bg-red-50 rounded-xl p-5 border border-red-200">
          <p class="font-black text-red-700 mb-3 flex items-center gap-2">⚠️ <span>في ناس بتبيع قطن عادي وتقول عليه "قطن مصري". خد بالك من الحاجات دي:</span></p>
          <ul class="space-y-3">
            <li class="flex items-start gap-2"><span class="text-green-600 text-xl">✓</span> <strong>اتأكد من البطاقة:</strong> القطن المصري الأصلي مكتوب عليه "100% Egyptian Cotton" أو "قطن مصري 100%" مش "Egyptian Cotton Blend"</li>
            <li class="flex items-start gap-2"><span class="text-green-600 text-xl">✓</span> <strong>الألياف:</strong> القطن المصري الأصلي ناعم جداً ومش بيخدش. لو حاسس بخشونة، مش قط مصري أصلي</li>
            <li class="flex items-start gap-2"><span class="text-green-600 text-xl">✓</span> <strong>السعر:</strong> لو السعر رخيص جداً، متصدقش. القطن المصري الأصلي سعره أعلى</li>
            <li class="flex items-start gap-2"><span class="text-green-600 text-xl">✓</span> <strong>البراند:</strong> اشتري من براندات موثوقة. في VELIX كل منتجاتنا قطن مصري 100% أصلي</li>
          </ul>
        </div>
      </div>

      <!-- 5. ليه تختار القطن المصري؟ -->
      <div id="why-choose">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">❤️</span>
          ٥. ليه تختار القطن المصري؟
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">😊</span><div><p class="font-black text-black">راحة لا توصف</p><p class="text-sm text-black/60">هتحس بالفرق من أول مرة تلبسه. ناعم على الجلد ومش بيحرق</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">🌍</span><div><p class="font-black text-black">بيئة أفضل</p><p class="text-sm text-black/60">بيتزرع بمبيدات أقل وبطرق طبيعية</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">🇪🇬</span><div><p class="font-black text-black">بتدعم الاقتصاد المصري</p><p class="text-sm text-black/60">بتدعم الفلاح المصري والصناعة الوطنية</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-start gap-3"><span class="text-2xl">💰</span><div><p class="font-black text-black">بتوفر فلوس على المدى الطويل</p><p class="text-sm text-black/60">القطن المصري هيعيش معاك سنين، العادي هتغير بعد كم شهر</p></div></div>
        </div>
      </div>

      <!-- 6. ازاي تعتني بالقطن المصري -->
      <div id="care">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🧼</span>
          ٦. ازاي تعتني بالقطن المصري؟
        </h2>
        <div class="bg-rose-gold/5 rounded-xl p-5 border border-rose-gold/20">
          <ul class="space-y-3">
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اغسل على ٣٠ درجة:</strong> الماية السخنة بتضعف الألياف الطويلة</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>متستخدمش مبيض:</strong> المبيض الكلوريني بيدمر القطن المصري</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>جفف في الهوا:</strong> النشافة (المجفف) بتقلص حجم القطن المصري وتضعفه</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اكوي على درجة حرارة متوسطة:</strong> حرارة عالية جداً ممكن تحرق الألياف</li>
          </ul>
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
          <span className="text-rose-gold font-bold">الفرق بين القطن المصري والقطن العادي</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🧵 خامات</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 7 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            الفرق بين القطن المصري والقطن العادي
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🇪🇬</div>
          <p className="text-rose-gold font-black text-xl mb-3">فخر الصناعة المصرية</p>
          <p className="text-black/70 font-bold mb-6">في VELIX، كل منتجاتنا قطن مصري ١٠٠٪ أصلي. بنشتري القطن من أفضل المزارع في مصر، وبنصنع كل حاجة بأيد مصرية في مصانعنا.</p>
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
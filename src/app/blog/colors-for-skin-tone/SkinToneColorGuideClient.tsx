// app/blog/دليل-الوان-الملابس-للبشرة/SkinToneColorGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SkinToneColorGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "دليل ألوان الملابس حسب لون البشرة";
    const text = "ازاي تختار اللون اللي يليق بيك حسب لون بشرتك - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"ليه في تيشرت لونه أحمر حلو عليا ومش حلو على صاحبي؟" "ليه لون معين بيخليني شيك ولون تاني بيخليني بايخ؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">الجواب ببساطة: <strong class="text-rose-gold">لون بشرتك!</strong> في المقال ده، هتعرف ازاي تحدد لون بشرتك بالظبط، وايه الألوان اللي تخليك شيك، وايه الألوان اللي تخليك بايخ. وبعد كده، هتختار هدومك بثقة 100%.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#how-to-know" class="text-rose-gold hover:underline">١. ازاي تعرف لون بشرتك؟</a></li>
          <li><a href="#light-skin" class="text-rose-gold hover:underline">٢. أفضل الألوان للبشرة الفاتحة</a></li>
          <li><a href="#medium-skin" class="text-rose-gold hover:underline">٣. أفضل الألوان للبشرة الحنطية (الأكتر شيوعاً)</a></li>
          <li><a href="#dark-skin" class="text-rose-gold hover:underline">٤. أفضل الألوان للبشرة السمراء</a></li>
          <li><a href="#safe-colors" class="text-rose-gold hover:underline">٥. الألوان اللي تناسب الجميع</a></li>
          <li><a href="#bad-colors" class="text-rose-gold hover:underline">٦. الألوان اللي تخليك بايخ</a></li>
          <li><a href="#tips" class="text-rose-gold hover:underline">٧. نصائح إضافية</a></li>
        </ul>
      </div>

      <!-- 1. ازاي تعرف لون بشرتك -->
      <div id="how-to-know">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔍</span>
          ١. ازاي تعرف لون بشرتك؟
        </h2>
        <p class="text-black/70 font-bold mb-4 leading-relaxed">في ٣ أنواع رئيسية للبشرة:</p>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center">
            <div class="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-2 border-2 border-rose-gold/30"></div>
            <p class="font-black text-black">البشرة الفاتحة</p>
            <p class="text-xs text-black/60">بيضا أو قمحاوية فاتحة جداً، بتحمر بسرعة في الشمس</p>
          </div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center">
            <div class="w-16 h-16 rounded-full bg-amber-600 mx-auto mb-2 border-2 border-rose-gold/30"></div>
            <p class="font-black text-black">البشرة الحنطية</p>
            <p class="text-xs text-black/60">الأكتر شيوعاً في مصر، لونها زي القمح أو العسل</p>
          </div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 text-center">
            <div class="w-16 h-16 rounded-full bg-amber-900 mx-auto mb-2 border-2 border-rose-gold/30"></div>
            <p class="font-black text-black">البشرة السمراء</p>
            <p class="text-xs text-black/60">بنية غامقة أو سوداء</p>
          </div>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-3">
          <p class="text-amber-700 font-bold text-sm flex items-center gap-2">💡 <span>طريقة العروق: لو عروقك زرقا، بشرتك فاتحة. لو عروقك خضرا، بشرتك حنطية. لو مش عارف تحدد، بشرتك سمراء.</span></p>
        </div>
      </div>

      <!-- 2. أفضل الألوان للبشرة الفاتحة -->
      <div id="light-skin">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">☀️</span>
          ٢. أفضل الألوان للبشرة الفاتحة
        </h2>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-4 py-2 bg-black text-white rounded-full text-sm font-bold">أسود</span>
          <span class="px-4 py-2 bg-blue-800 text-white rounded-full text-sm font-bold">كحلي</span>
          <span class="px-4 py-2 bg-red-700 text-white rounded-full text-sm font-bold">بورجوندي</span>
          <span class="px-4 py-2 bg-green-800 text-white rounded-full text-sm font-bold">أخضر عسكري</span>
          <span class="px-4 py-2 bg-purple-700 text-white rounded-full text-sm font-bold">بنفسجي</span>
          <span class="px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-bold">رمادي غامق</span>
        </div>
        <p class="text-black/70 font-bold leading-relaxed">الألوان الداكنة بتدي <strong class="text-rose-gold">تباين حلو</strong> مع البشرة الفاتحة. خليك بعيد عن الألوان الفاتحة جداً (بيج فاتح، أبيض ثلجي) عشان متبانش <strong class="text-rose-gold">شاحب</strong>.</p>
      </div>

      <!-- 3. أفضل الألوان للبشرة الحنطية -->
      <div id="medium-skin">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🌾</span>
          ٣. أفضل الألوان للبشرة الحنطية (الأكتر شيوعاً في مصر)
        </h2>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-4 py-2 bg-white text-black rounded-full text-sm font-bold border">أبيض</span>
          <span class="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-bold">رمادي</span>
          <span class="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold">أزرق سماوي</span>
          <span class="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold">أحمر</span>
          <span class="px-4 py-2 bg-yellow-600 text-white rounded-full text-sm font-bold">أصفر خردلي</span>
          <span class="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold">أخضر زيتي</span>
          <span class="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-bold">تركواز</span>
          <span class="px-4 py-2 bg-rose-600 text-white rounded-full text-sm font-bold">وردي فاتح</span>
        </div>
        <p class="text-black/70 font-bold leading-relaxed">البشرة الحنطية بتناسبها <strong class="text-rose-gold">الألوان الدافئة والترابية</strong>. الألوان المحايدة زي الأبيض والرمادي والأسود برضه ممتازة. بس خلي بالك من <strong class="text-rose-gold">الأصفر الفاقع والأخضر النيوني</strong>.</p>
      </div>

      <!-- 4. أفضل الألوان للبشرة السمراء -->
      <div id="dark-skin">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🌙</span>
          ٤. أفضل الألوان للبشرة السمراء
        </h2>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-4 py-2 bg-white text-black rounded-full text-sm font-bold border">أبيض</span>
          <span class="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold">أحمر</span>
          <span class="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-bold">أصفر</span>
          <span class="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold">برتقالي</span>
          <span class="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold">أخضر زاهي</span>
          <span class="px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-bold">وردي نيون</span>
          <span class="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-bold">بنفسجي فاتح</span>
          <span class="px-4 py-2 bg-blue-400 text-white rounded-full text-sm font-bold">أزرق كهربائي</span>
        </div>
        <p class="text-black/70 font-bold leading-relaxed">البشرة السمراء بتناسبها <strong class="text-rose-gold">الألوان الزاهية والجريئة</strong>. الألوان المشرقة بتبرز جمال البشرة الداكنة. الألوان الداكنة جداً (أسود، كحلي) ممكن تخلي شكلك باهت، فخليك في <strong class="text-rose-gold">الألوان الفاتحة والزاهية</strong>.</p>
      </div>

      <!-- 5. الألوان اللي تناسب الجميع -->
      <div id="safe-colors">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">✅</span>
          ٥. الألوان اللي تناسب الجميع (آمنة)
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-white p-4 rounded-xl border border-rose-gold/20 shadow-sm hover:shadow-md transition"><div class="w-12 h-12 bg-black rounded-full mx-auto shadow-md"></div><p class="text-sm font-bold mt-2 text-black">أسود</p></div>
          <div class="bg-white p-4 rounded-xl border border-rose-gold/20 shadow-sm hover:shadow-md transition"><div class="w-12 h-12 bg-white border-2 border-gray-300 rounded-full mx-auto"></div><p class="text-sm font-bold mt-2 text-black">أبيض</p></div>
          <div class="bg-white p-4 rounded-xl border border-rose-gold/20 shadow-sm hover:shadow-md transition"><div class="w-12 h-12 bg-gray-500 rounded-full mx-auto shadow-md"></div><p class="text-sm font-bold mt-2 text-black">رمادي</p></div>
          <div class="bg-white p-4 rounded-xl border border-rose-gold/20 shadow-sm hover:shadow-md transition"><div class="w-12 h-12 bg-blue-900 rounded-full mx-auto shadow-md"></div><p class="text-sm font-bold mt-2 text-black">كحلي</p></div>
        </div>
        <p class="text-black/60 text-sm text-center mt-3">✨ الـ 4 ألوان دول أساس أي دولاب، هتنسق مع أي حاجة وهتناسب أي بشرة</p>
      </div>

      <!-- 6. الألوان اللي تخليك بايخ -->
      <div id="bad-colors">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">⚠️</span>
          ٦. الألوان اللي تخليك بايخ (خليك بعيد عنها)
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">👱 للبشرة الفاتحة</p><p class="text-sm">بيج فاتح، أبيض ثلجي، بيبي بلو (أزرق فاتح جداً)</p></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">🟤 للبشرة الحنطية</p><p class="text-sm">أصفر نيوني، أخضر نيوني، برتقالي فاقع</p></div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-200"><p class="font-black text-red-700 mb-2">⚫ للبشرة السمراء</p><p class="text-sm">أسود، كحلي، بني غامق (لوحدهم من غير حاجة فاتحة جنبهم)</p></div>
        </div>
      </div>

      <!-- 7. نصائح إضافية -->
      <div id="tips">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">💡</span>
          ٧. نصائح إضافية
        </h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>الأبيض والأسود أساس أي دولاب</strong> - الاتنين بيكملوا أي لون وبيصلحوا أي غلطة</li>
          <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>جرب ألوان جديدة</strong> - ماتخافش تجرب حاجة جديدة، يمكن تكتشف لون حلو عليك</li>
          <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اللون مش كل حاجة</strong> - الخامة والمقاس والقصّة أهم بكتير من اللون</li>
          <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>الثقة في النفس</strong> - أي لون هتلبسه بثقة هيبقى حلو عليك. أهم حاجة تكون مرتاح ومبسوط</li>
        </ul>
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
          <span className="text-rose-gold font-bold">دليل ألوان الملابس حسب لون البشرة</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🎨 ستايل</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 6 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            دليل ألوان الملابس حسب لون البشرة
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🎨</div>
          <p className="text-rose-gold font-black text-xl mb-3">في VELIX عندنا كل الألوان</p>
          <p className="text-black/70 font-bold mb-6">من الأبيض للأسود، ومن الرمادي للكحلي، ومن البيج للأخضر العسكري. اختار اللون اللي يناسب بشرتك واستمتع بأجود خامات القطن المصري.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق دلوقتي واختار اللون اللي يناسبك
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
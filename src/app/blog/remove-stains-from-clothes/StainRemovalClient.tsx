// app/blog/ازاي-تزيل-البقع-من-الملابس/StainRemovalClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function StainRemovalClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تزيل البقع من الملابس";
    const text = "دليل كامل لتنظيف أي نوع بقع - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"حطيت قطعة زبدة على التيشرت الأبيض من غير قصد؟" أو "اترش عليك قهوة في الشغل؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">متقلقش، البقع دي بتتزيل لو عرفت <strong class="text-rose-gold">الطريقة الصح</strong>. في المقال ده، هقولك ازاي تزيل أي نوع بقعة - زيت، قهوة، شاي، دم، حبر، وماكياج - بطرق طبيعية وكيميائية.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#golden-rule" class="text-rose-gold hover:underline">١. القاعدة الذهبية</a></li>
          <li><a href="#oil-stains" class="text-rose-gold hover:underline">٢. بقع الزيت والسمن والصلصة</a></li>
          <li><a href="#drink-stains" class="text-rose-gold hover:underline">٣. بقع القهوة والشاي والعصير</a></li>
          <li><a href="#blood-stains" class="text-rose-gold hover:underline">٤. بقع الدم</a></li>
          <li><a href="#ink-stains" class="text-rose-gold hover:underline">٥. بقع الحبر (قلم جاف)</a></li>
          <li><a href="#makeup-stains" class="text-rose-gold hover:underline">٦. بقع الماكياج</a></li>
          <li><a href="#general-tips" class="text-rose-gold hover:underline">٧. نصائح عامة</a></li>
        </ul>
      </div>

      <!-- 1. القاعدة الذهبية -->
      <div id="golden-rule">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">القاعدة الذهبية: أسرع، أحسن</h2></div>
        <div class="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center">
          <div class="flex items-center justify-center gap-2"><span class="text-3xl">⚠️</span><p class="text-amber-700 font-black text-lg">أسرع ما تبقى البقعة، أسهل إزالتها. متستناش، اشتغل عليها فوراً.</p></div>
        </div>
      </div>

      <!-- 2. بقع الزيت -->
      <div id="oil-stains">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">إزالة بقع الزيت والسمن والصلصة</h2></div>
        <p class="text-black/70 font-bold mb-3">ده أصعب نوع بقع، بس فيه حل:</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-xl p-4 border border-green-200"><p class="font-black text-green-700 mb-2">🌿 الطريقة الطبيعية</p><p class="text-sm">حط بودرة تالك أو نشا أو دقيق على البقعة، استنى ١٠-١٥ دقيقة عشان تمتص الزيت، بعدين افركها بفرشاة واغسل</p></div>
          <div class="bg-blue-50 rounded-xl p-4 border border-blue-200"><p class="font-black text-blue-700 mb-2">🧪 الطريقة الكيميائية</p><p class="text-sm">حط شوية سائل غسيل الأطباق على البقعة، افرك بشوية ماية ساقعة، بعدين اغسل كالمعتاد</p></div>
        </div>
      </div>

      <!-- 3. بقع القهوة والشاي -->
      <div id="drink-stains">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">إزالة بقع القهوة والشاي والعصير</h2></div>
        <div class="space-y-3">
          <div class="flex items-start gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">قهوة أو شاي ساخن:</strong> اغسل البقعة بماية ساقعة فوراً، بعدين حط شوية خل أبيض، بعدين اغسل كالمعتاد</div>
          <div class="flex items-start gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">عصير (برتقال، طماطم، مانجو):</strong> اغسل بماية ساقعة، بعدين حط شوية مبيض آمن للألوان</div>
        </div>
      </div>

      <!-- 4. بقع الدم -->
      <div id="blood-stains">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">إزالة بقع الدم</h2></div>
        <div class="bg-red-50 rounded-xl p-5 border border-red-200 mb-4">
          <div class="flex items-center justify-center gap-2"><span class="text-3xl">⚠️</span><p class="text-red-700 font-black text-center text-lg">ماية ساقعة بس! الماية السخنة بتثبت بقعة الدم وما تخرجش تاني.</p></div>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">🩸 بقعة جديدة</p><p class="text-sm">اغسل بماية ساقعة وصابون، هتخرج بسهولة</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">🩸 بقعة قديمة</p><p class="text-sm">انقع القطعة في ماية ساقعة وملح لمدة ساعة، بعدين اغسل</p></div>
        </div>
      </div>

      <!-- 5. بقع الحبر -->
      <div id="ink-stains">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">إزالة بقع الحبر (قلم جاف)</h2></div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">✒️ كحول أو مثبت شعر</p><p class="text-sm">حط كحول على البقعة، امسحها بقطنة نظيفة (متفركش)</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">🥛 حليب</p><p class="text-sm">انقع القطعة في حليب دافي لمدة ساعة، بعدين اغسل</p></div>
        </div>
      </div>

      <!-- 6. بقع الماكياج -->
      <div id="makeup-stains">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">إزالة بقع الماكياج (فونديشن، أحمر شفايف)</h2></div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">💄 ماكياج زيتي</p><p class="text-sm">استخدم مزيل ماكياج زيتي، بعدين اغسل بصابون</p></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><p class="font-black text-black mb-2">💋 أحمر شفايف</p><p class="text-sm">حط شوية معجون أسنان على البقعة، افرك براحة، بعدين اغسل</p></div>
        </div>
      </div>

      <!-- 7. نصائح عامة -->
      <div id="general-tips">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">7</span><h2 class="text-2xl md:text-3xl font-black text-black">نصائح عامة لإزالة البقع</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">اختبر المنتج على مكان خفي</strong> - قبل ما تحط أي مادة كيميائية، جربها على مكان مش باين</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">متفركش البقعة بعنف</strong> - الفرك بيوصل البقعة للألياف ويتلف القماش</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">استخدم صابون غسيل الأطباق</strong> - ممتاز للبقع الدهنية</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">الخل الأبيض</strong> - من أفضل المواد الطبيعية لإزالة البقع</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> <strong class="font-black">بيكربونات الصوديوم</strong> - ممتاز للبقع الصعبة وللتخلص من الروائح</div>
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
          <span className="text-rose-gold font-bold">ازاي تزيل البقع من الملابس</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🧼 عناية</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 8 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تزيل البقع من الملابس - دليل كامل لتنظيف أي نوع بقع
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-rose-gold font-black text-xl mb-3">أحسن طريقة إنك متضطرش تشيل بقع</p>
          <p className="text-black/70 font-bold mb-6">اشتري خامات كويسة من الأول. في VELIX كل المنتجات قطن مصري ١٠٠٪، بيتغسل بسهولة والبقع مش بتلزق فيه زي الأقمشة الرخيصة.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق دلوقتي
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
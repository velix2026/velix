// app/blog/ازاي-تغسل-الهودي-والتيشرت/WashingGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function WashingGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد";
    const text = "دليل كامل لغسيل الهوديز والتيشرتات - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"غسلت الهودي مرة واحدة ولقيت حجمه قل؟" أو "لون التيشرت اتغير بعد أول غسلة؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">المقال ده هيخليك تغسل ملابسك صح عشان تعيش معاك أطول فترة. <strong class="text-rose-gold">دليل كامل للغسيل والنشافة والكي</strong> هتحافظ به على هدومك لسنين.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#read-tag" class="text-rose-gold hover:underline">١. قبل ما تبدأ: اقرأ البطاقة</a></li>
          <li><a href="#wash-hoodie" class="text-rose-gold hover:underline">٢. ازاي تغسل الهودي صح</a></li>
          <li><a href="#dry-hoodie" class="text-rose-gold hover:underline">٣. ازاي تنشف الهودي (أهم خطوة)</a></li>
          <li><a href="#wash-tshirt" class="text-rose-gold hover:underline">٤. ازاي تغسل التيشرت</a></li>
          <li><a href="#iron" class="text-rose-gold hover:underline">٥. ازاي تكوي التيشرت والهودي</a></li>
          <li><a href="#extra-tips" class="text-rose-gold hover:underline">٦. نصائح إضافية</a></li>
        </ul>
      </div>

      <!-- 1. اقرأ البطاقة -->
      <div id="read-tag">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">قبل ما تبدأ: اقرأ البطاقة</h2></div>
        <p class="text-black/70 font-bold mb-3">كل قطعة ملابس ليها بطاقة فيها رموز. الرموز دي مش للزينة، هي بتقولك ازاي تعتني بالقطعة.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-white p-3 rounded-xl border border-rose-gold/20"><div class="text-3xl">🧼</div><div class="text-sm font-bold mt-1">غسيل عادي</div><div class="text-[10px] text-black/50">برنامج عادي</div></div>
          <div class="bg-white p-3 rounded-xl border border-rose-gold/20"><div class="text-3xl">🫗</div><div class="text-sm font-bold mt-1">غسيل يدوي</div><div class="text-[10px] text-black/50">ما تتحطش في الغسالة</div></div>
          <div class="bg-white p-3 rounded-xl border border-rose-gold/20"><div class="text-3xl">🔴</div><div class="text-sm font-bold mt-1">ممنوع المبيض</div><div class="text-[10px] text-black/50">المبيض بيدمر الألوان</div></div>
          <div class="bg-white p-3 rounded-xl border border-rose-gold/20"><div class="text-3xl">🟢</div><div class="text-sm font-bold mt-1">ممنوع النشافة</div><div class="text-[10px] text-black/50">بتقلص حجم الملابس</div></div>
        </div>
      </div>

      <!-- 2. ازاي تغسل الهودي صح -->
      <div id="wash-hoodie">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تغسل الهودي صح</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> اقلبه على الوجه التاني عشان الطباعة ماتتأكلش</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> استخدم ماية ساقعة (٣٠ درجة)</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> استخدم مسحوق غسيل خفيف</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> متستخدمش مبيض</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> استخدم برنامج "لطيف" أو "Delicate"</div>
        </div>
      </div>

      <!-- 3. ازاي تنشف الهودي (أهم خطوة) -->
      <div id="dry-hoodie">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تنشف الهودي <span class="text-rose-gold">(أهم خطوة!)</span></h2></div>
        <div class="bg-red-50 rounded-xl p-5 border border-red-200 mb-4">
          <div class="flex items-center justify-center gap-2"><span class="text-3xl">⚠️</span><p class="text-red-700 font-black text-center text-lg">متحطش الهودي في النشافة (المجفف)!</p></div>
          <p class="text-red-600 mt-2 text-center">النشافة بتقلص حجم الهودي وتضعف الألياف وتخلي الطباعة تتشقق. جربها مرة وهتندم.</p>
        </div>
        <p class="font-black text-black mb-2">الطريقة الصح:</p>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-2"><span class="text-green-500">✓</span> انشر الهودي في الهوا</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-500">✓</span> بعيد عن الشمس المباشرة</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-500">✓</span> استخدم شماعة عريضة عشان متتكتفش</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-500">✓</span> متعلقش الهودي وهو تقيل بالمية</div>
        </div>
      </div>

      <!-- 4. ازاي تغسل التيشرت -->
      <div id="wash-tshirt">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تغسل التيشرت</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> افصل الأبيض عن الملون</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> استخدم ماية ساقعة</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> اقلبه على الوجه التاني</div>
          <div class="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500">✓</span> متزودش المسحوق</div>
        </div>
      </div>

      <!-- 5. ازاي تكوي التيشرت والهودي -->
      <div id="iron">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تكوي التيشرت والهودي</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> استخدم درجة حرارة متوسطة</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اكوي على الوجه التاني</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> التيشرت المبلول شوية أسهل في الكي</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> الهودي غالباً مش محتاج كي</div>
        </div>
      </div>

      <!-- 6. نصائح إضافية -->
      <div id="extra-tips">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">نصائح إضافية</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> اغسل الملابس الجديدة لوحدها أول مرة (فيه أصباغ بتنزل)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> متسيبش الملابس المبلولة في الغسالة (بتجيب ريحة عفن)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> استخدم الخل الأبيض للملابس البيضاء (بيخلي الأبيض أنقى وألمع)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-rose-gold">✓</span> الملابس الداخلية تتغسل على ٦٠ درجة (عشان التعقيم)</div>
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
          <span className="text-rose-gold font-bold">ازاي تغسل الهودي والتيشرت</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🧼 عناية</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 7 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد
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
          <p className="text-rose-gold font-black text-xl mb-3">عايز هودي وتيشرت يعيشوا معاك سنين؟</p>
          <p className="text-black/70 font-bold mb-6">في VELIX كل منتجاتنا قطن مصري ١٠٠٪ عالي الجودة. اشتري مرة وحدة واستمتع بسنين.</p>
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
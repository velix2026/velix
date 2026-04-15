// app/blog/ازاي-تحافظ-على-ملابسك/ClothingCareClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ClothingCareClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تحافظ على ملابسك لأطول فترة؟";
    const text = "10 نصائح ذهبية للعناية بالملابس - من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"عايز ملابسك تفضل زي الجديدة لسنين؟" "زهقت إن هدومك بتتغير بسرعة؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هقولك <strong class="text-rose-gold">10 نصائح ذهبية</strong> للعناية بالملابس في الغسيل والتخزين والكي. هتوفر فلوس كتير بدل ما تشتري هدوم جديدة كل شوية!</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#tip1" class="text-rose-gold hover:underline">١. اقرأ تعليمات الغسيل على البطاقة</a></li>
          <li><a href="#tip2" class="text-rose-gold hover:underline">٢. افصل الألوان قبل الغسيل</a></li>
          <li><a href="#tip3" class="text-rose-gold hover:underline">٣. اختار درجة حرارة مناسبة</a></li>
          <li><a href="#tip4" class="text-rose-gold hover:underline">٤. متستخدمش كمية مسحوق كتير</a></li>
          <li><a href="#tip5" class="text-rose-gold hover:underline">٥. اقلب الملابس على الوجه التاني</a></li>
          <li><a href="#tip6" class="text-rose-gold hover:underline">٦. استخدم أكياس الغسيل للأشياء الحساسة</a></li>
          <li><a href="#tip7" class="text-rose-gold hover:underline">٧. متستخدمش النشافة (المجفف) كتير</a></li>
          <li><a href="#tip8" class="text-rose-gold hover:underline">٨. كوي الملابس وهي لسه مبلولة شوية</a></li>
          <li><a href="#tip9" class="text-rose-gold hover:underline">٩. خزن الملابس بشكل مناسب</a></li>
          <li><a href="#tip10" class="text-rose-gold hover:underline">١٠. تخلص من البقع فوراً</a></li>
        </ul>
      </div>

      <!-- النصيحة 1 -->
      <div id="tip1">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">اقرأ تعليمات الغسيل على البطاقة</h2></div>
        <p class="text-black/70 font-bold mb-3">الرمز اللي على البطاقة مش للزينة. الرموز دي بتقولك:</p>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><div class="text-3xl">🧼</div><p class="text-xs font-bold mt-1">الحوض وفيه رقم</p><p class="text-[10px] text-black/50">أقصى درجة حرارة</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><div class="text-3xl">🫗</div><p class="text-xs font-bold mt-1">الإيد في الحوض</p><p class="text-[10px] text-black/50">غسيل يدوي</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><div class="text-3xl">🔴</div><p class="text-xs font-bold mt-1">الدائرة المثلث</p><p class="text-[10px] text-black/50">ممنوع المبيض</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><div class="text-3xl">🟢</div><p class="text-xs font-bold mt-1">المربع والدائرة</p><p class="text-[10px] text-black/50">ممنوع النشافة</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><div class="text-3xl">🔵</div><p class="text-xs font-bold mt-1">المكواة والنقط</p><p class="text-[10px] text-black/50">درجة حرارة الكي</p></div>
        </div>
      </div>

      <!-- النصيحة 2 -->
      <div id="tip2">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">افصل الألوان قبل الغسيل</h2></div>
        <p class="text-black/70 font-bold mb-3">ده أهم قانون في الغسيل:</p>
        <div class="grid md:grid-cols-4 gap-3">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 text-center"><div class="w-10 h-10 bg-white border rounded-full mx-auto"></div><p class="text-sm font-bold mt-1">الأبيض مع الأبيض</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 text-center"><div class="w-10 h-10 bg-amber-200 rounded-full mx-auto"></div><p class="text-sm font-bold mt-1">الفاتح مع الفاتح</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 text-center"><div class="w-10 h-10 bg-gray-700 rounded-full mx-auto"></div><p class="text-sm font-bold mt-1">الغامق مع الغامق</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 text-center"><div class="w-10 h-10 bg-red-600 rounded-full mx-auto"></div><p class="text-sm font-bold mt-1">الأحمر لوحده أول ٣ مرات</p></div>
        </div>
      </div>

      <!-- النصيحة 3 -->
      <div id="tip3">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">اختار درجة حرارة مناسبة</h2></div>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200"><span class="text-2xl">🌡️</span><div><strong class="font-black">٣٠ درجة مئوية</strong><p class="text-sm">للتشيرتات والهوديز الخفيفة (الأفضل لمعظم الملابس)</p></div></div>
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200"><span class="text-2xl">🌡️</span><div><strong class="font-black">٤٠ درجة مئوية</strong><p class="text-sm">للملابس الداخلية والمناشف (للتطهير)</p></div></div>
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200"><span class="text-2xl">🌡️</span><div><strong class="font-black">٦٠ درجة فأكتر</strong><p class="text-sm">للبياضات والمناشف اللي محتاجة تنظيف عميق</p></div></div>
        </div>
        <div class="bg-red-50 rounded-xl p-3 mt-3 border border-red-200"><p class="text-red-700 font-bold text-sm flex items-center gap-2">⚠️ <span>الماية السخنة بتقلص حجم الملابس القطنية وتضعف الألياف. استخدمها بس عند الحاجة.</span></p></div>
      </div>

      <!-- النصيحة 4 -->
      <div id="tip4">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">مستخدمش كمية مسحوق كتير</h2></div>
        <div class="grid md:grid-cols-3 gap-3">
          <div class="bg-red-50 rounded-xl p-3 border border-red-200 text-center"><div class="text-2xl">🧴</div><p class="text-sm font-bold">بيتراكم على القماش</p><p class="text-xs">يعمل بقع بيضا</p></div>
          <div class="bg-red-50 rounded-xl p-3 border border-red-200 text-center"><div class="text-2xl">💪</div><p class="text-sm font-bold">بيضعف الألياف</p><p class="text-xs">مع الوقت</p></div>
          <div class="bg-red-50 rounded-xl p-3 border border-red-200 text-center"><div class="text-2xl">🤧</div><p class="text-sm font-bold">بيسبب حساسية</p><p class="text-xs">للبشرة</p></div>
        </div>
        <p class="text-black/60 text-sm mt-2 text-center">استخدم الكمية الموصى بها على العبوة، أو أقل شوية.</p>
      </div>

      <!-- النصيحة 5 -->
      <div id="tip5">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">اقلب الملابس على الوجه التاني</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">👕</span><div><p class="font-black">التيشرتات والهوديز</p><p class="text-sm">عشان الطباعة ماتتأكلش</p></div></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20 flex items-center gap-2"><span class="text-2xl">👖</span><div><p class="font-black">البناطيل والجينز</p><p class="text-sm">عشان تحافظ على اللون</p></div></div>
        </div>
      </div>

      <!-- النصيحة 6 -->
      <div id="tip6">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">استخدم أكياس الغسيل للأشياء الحساسة</h2></div>
        <p class="text-black/70 font-bold">أكياس الغسيل الشبكية بتحمي التيشرتات اللي فيها خرز أو تطريز، وبرضه بتخليك تلاقي الجوارب الصغيرة بسهولة.</p>
      </div>

      <!-- النصيحة 7 -->
      <div id="tip7">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">7</span><h2 class="text-2xl md:text-3xl font-black text-black">مستخدمش النشافة (المجفف) كتير</h2></div>
        <div class="bg-red-50 rounded-xl p-4 border border-red-200 mb-3">
          <p class="text-red-700 font-black text-center">⚠️ النشافة بتقلص حجم الملابس القطنية وتضعف الألياف ⚠️</p>
        </div>
        <ul class="space-y-2">
          <li class="flex items-start gap-2"><span class="text-green-600">✓</span> نشر الملابس في الهوا بعيد عن الشمس المباشرة</li>
          <li class="flex items-start gap-2"><span class="text-green-600">✓</span> لو مضطر تستخدم النشافة، استخدم درجة حرارة منخفضة</li>
          <li class="flex items-start gap-2"><span class="text-green-600">✓</span> الملابس الداخلية والتيشرتات اللي فيها مطاط → متحطهاش في النشافة أبداً</li>
        </ul>
      </div>

      <!-- النصيحة 8 -->
      <div id="tip8">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">8</span><h2 class="text-2xl md:text-3xl font-black text-black">كوي الملابس وهي لسه مبلولة شوية</h2></div>
        <p class="text-black/70 font-bold">أسهل طريقة للكي السريع والنظيف: خلي الملابس لسه مبلولة شوية من النشافة أو من الهوا، الكي هيكون أسهل وهتطلع النتيجة أحسن.</p>
      </div>

      <!-- النصيحة 9 -->
      <div id="tip9">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">9</span><h2 class="text-2xl md:text-3xl font-black text-black">خزن الملابس بشكل مناسب</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">👕</span><p class="font-black mt-1">التيشرتات الصيفية</p><p class="text-sm">اطويها وخزنها في دولاب في مكان بارد</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">🧥</span><p class="font-black mt-1">الهوديز الشتوية</p><p class="text-sm">علقها على شماعات عريضة عشان متتكتفش</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">📦</span><p class="font-black mt-1">التخزين الموسمي</p><p class="text-sm">استخدم أكياس مفرغة من الهواء لتوفير مكان</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">🌿</span><p class="font-black mt-1">منع العثة</p><p class="text-sm">حط ورق سدر أو كرات عطرية</p></div>
        </div>
      </div>

      <!-- النصيحة 10 -->
      <div id="tip10">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">10</span><h2 class="text-2xl md:text-3xl font-black text-black">تخلص من البقع فوراً</h2></div>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">🫒</span><p class="font-black">زيت أو سمن</p><p class="text-sm">حط بودرة تالك أو نشا، استنى ١٠ دقايق، بعدين اغسل</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">☕</span><p class="font-black">قهوة أو شاي</p><p class="text-sm">اغسل على طول بماية ساقعة (باردة)</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">🩸</span><p class="font-black">دم</p><p class="text-sm">ماية ساقعة بس، متستخدمش ماية سخنة</p></div>
          <div class="bg-white rounded-xl p-3 border border-rose-gold/20"><span class="text-2xl">✒️</span><p class="font-black">حبر (قلم جاف)</p><p class="text-sm">حط كحول أو مثبت شعر، بعدين اغسل</p></div>
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
          <span className="text-rose-gold font-bold">ازاي تحافظ على ملابسك</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">🧼 عناية</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 10 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تحافظ على ملابسك لأطول فترة؟ 10 نصائح ذهبية
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
          <p className="text-rose-gold font-black text-xl mb-3">نصيحة أخيرة</p>
          <p className="text-black/70 font-bold mb-6">أحسن طريقة تحافظ بيها على ملابسك هي إنك تشتري خامات كويسة من الأول. في VELIX كل منتجاتنا قطن مصري ١٠٠٪ عشان تعيش معاك لأطول فترة.</p>
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
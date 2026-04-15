// app/blog/دليل-المقاسات-الكامل/SizeGuideClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SizeGuideClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "دليل المقاسات الكامل";
    const text = "ازاي تختار المقاس المناسب لأي قطعة ملابس - دليل كامل من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"طلبت تيشرت أونلاين ولما وصل كان ضيق عليا؟" أو "الهودي طلع واسع أوي مش زي ما كنت متخيل؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">المشكلة دي بتحصل مع ناس كتير، والسبب الرئيسي إنهم <strong class="text-rose-gold">ميعرفوش يقيسوا نفسهم صح</strong> أو مش فاهمين <strong class="text-rose-gold">جدول المقاسات</strong>.</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">النهاردة هنقدملك <strong class="text-rose-gold">الدليل الأكمل في مصر</strong> لقياس الجسم واختيار المقاس المناسب لأي قطعة ملابس. بعد المقال ده، هتطلب أونلاين من غير ما تغلط أبداً.</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#tools" class="text-rose-gold hover:underline">١. الأدوات اللي هتحتاجها</a></li>
          <li><a href="#measure" class="text-rose-gold hover:underline">٢. ازاي تقيس جسمك خطوة بخطوة</a></li>
          <li><a href="#table" class="text-rose-gold hover:underline">٣. جدول المقاسات العالمي</a></li>
          <li><a href="#products" class="text-rose-gold hover:underline">٤. مقاسات المنتجات المختلفة</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٥. أخطاء شائعة</a></li>
          <li><a href="#tips" class="text-rose-gold hover:underline">٦. نصائح إضافية</a></li>
        </ul>
      </div>

      <!-- 1. الأدوات -->
      <div id="tools">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🛠️</span>
          ١. الأدوات اللي هتحتاجها عشان تقيس نفسك صح
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">📏</span><div><p class="font-black text-black">شريط قياس (متر قماش)</p><p class="text-xs text-black/60">موجود في أي مكتبة بـ ١٠-٢٠ جنيه</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">🪞</span><div><p class="font-black text-black">مراية كبيرة</p><p class="text-xs text-black/60">عشان تشوف نفسك وأماكن القياس</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">📝</span><div><p class="font-black text-black">ورقة وقلم</p><p class="text-xs text-black/60">عشان تكتب المقاسات عشان ماتنساش</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">👥</span><div><p class="font-black text-black">مساعدة من حد (اختياري)</p><p class="text-xs text-black/60">لو في حد يساعدك هيبقي أسهل</p></div></div>
        </div>
      </div>

      <!-- 2. ازاي تقيس جسمك -->
      <div id="measure">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📏</span>
          ٢. ازاي تقيس جسمك خطوة بخطوة
        </h2>
        
        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">أ.</span> محيط الصدر (Chest)</h3>
          <p class="text-black/70 font-bold mb-3">ده أهم قياس للتيشرتات والهوديز. القياس الصح هيديك راحة في اللبس وشكل أنيق.</p>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> لف شريط القياس حوالين أعرض جزء في صدرك (تحت الإبط بشوية)</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> خلي الشريط مستوي ومش مائل</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">3️⃣</span> متشدش الشريط أوي ولا تخليه فضفاض</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">4️⃣</span> اتنفس طبيعي ومتحبسش نفسك</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">ب.</span> طول الجسم (Length)</h3>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> ابدأ من أعلى نقطة في كتفك (عند الرقبة)</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> انزل بشريط القياس لحد ما توصل للمكان اللي عايز التيشرت يوصل له</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">3️⃣</span> للتيشرتات القصيرة: وقف عند الخصر (وسط بنطلونك)</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">ج.</span> عرض الكتف (Shoulder Width)</h3>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> قس المسافة بين طرف كتفك الأيمن وطرف كتفك الأيسر</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> خلي شريط القياس مستوي على ضهرك</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">د.</span> محيط الخصر (Waist)</h3>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> لف شريط القياس حوالين أنحف جزء في خصرك</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> متشدش البطن ولا تسترخي أوي، خليك طبيعي</li>
          </ul>
        </div>
      </div>

      <!-- 3. جدول المقاسات -->
      <div id="table">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">📊</span>
          ٣. جدول المقاسات العالمي مقابل المقاسات العربية
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-rose-gold/10">
                <th class="border border-rose-gold/20 p-3 text-center font-black">المقاس</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">العربي</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">الصدر (سم)</th>
                <th class="border border-rose-gold/20 p-3 text-center font-black">الطول (سم)</th>
               </tr>
            </thead>
            <tbody>
              <tr><td class="border p-3 text-center font-bold">XS</td><td class="border p-3 text-center">صغير جداً</td><td class="border p-3 text-center">86-91</td><td class="border p-3 text-center">66-68</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">S</td><td class="border p-3 text-center">صغير</td><td class="border p-3 text-center">91-96</td><td class="border p-3 text-center">68-70</td></tr>
              <tr><td class="border p-3 text-center font-bold">M</td><td class="border p-3 text-center">وسط</td><td class="border p-3 text-center">96-101</td><td class="border p-3 text-center">70-72</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">L</td><td class="border p-3 text-center">كبير</td><td class="border p-3 text-center">101-106</td><td class="border p-3 text-center">72-74</td></tr>
              <tr><td class="border p-3 text-center font-bold">XL</td><td class="border p-3 text-center">كبير جداً</td><td class="border p-3 text-center">106-111</td><td class="border p-3 text-center">74-76</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center font-bold">2XL</td><td class="border p-3 text-center">كبير جداً 2</td><td class="border p-3 text-center">111-116</td><td class="border p-3 text-center">76-78</td></tr>
              <tr><td class="border p-3 text-center font-bold">3XL</td><td class="border p-3 text-center">كبير جداً 3</td><td class="border p-3 text-center">116-121</td><td class="border p-3 text-center">78-80</td></tr>
            </tbody>
           </table>
        </div>
        <p class="text-xs text-black/40 text-center mt-2">* الجدول تقريبي وممكن يختلف من براند للتاني. دايمن راجع جدول المقاسات بتاع المنتج نفسه.</p>
      </div>

      <!-- 4. مقاسات المنتجات المختلفة -->
      <div id="products">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">👕</span>
          ٤. مقاسات المنتجات المختلفة
        </h2>
        
        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3">التيشرتات حسب القصة (Fit):</h3>
          <ul class="space-y-2">
            <li><strong class="text-rose-gold">Slim Fit:</strong> بيناسب الجسم النحيف، بيبين العضلات ويعطي شكل أنحف</li>
            <li><strong class="text-rose-gold">Regular Fit:</strong> المقاس الأكتر انتشاراً، بيناسب كل الأجسام</li>
            <li><strong class="text-rose-gold">Oversize:</strong> الموضة دلوقتي، بيدي شكل كاجوال وعصري ويخفي العيوب</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20">
          <h3 class="text-xl font-black text-black mb-3">الهوديز:</h3>
          <ul class="space-y-2">
            <li>الهوديز بتكون <strong class="text-rose-gold">أكبر من التيشرتات بنفس المقاس</strong> بحوالي ٢-٣ سم</li>
            <li>لو عايز هودي مريح، خد نفس مقاس التيشرت</li>
            <li>لو عايز هودي أوفر سايز، خد مقاس أكبر بدرجة</li>
          </ul>
        </div>
      </div>

      <!-- 5. أخطاء شائعة -->
      <div id="mistakes">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">⚠️</span>
          ٥. أخطاء شائعة في اختيار المقاس
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تخد مقاس أصغر عشان "أخس"</strong><p class="text-sm text-black/60">التيشرت الضيق أوي مش شيك وهيضايقك طول اليوم</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">متقارنش مقاسك بمقاس صاحبك</strong><p class="text-sm text-black/60">كل جسم مختلف، اللي يناسب صاحبك مش شرط يناسبك</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تخد مقاس أكبر عشان "تكون مريح"</strong><p class="text-sm text-black/60">التيشرت الواسع أوي مش مريح وهتحس إنك لابس كيس</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">متخدش بالك من الخامة</strong><p class="text-sm text-black/60">الأقمشة المطاطة بتناسب مقاس أصغر، والأقمشة القطن ١٠٠٪ بتناسب مقاسك الطبيعي</p></div></div>
        </div>
      </div>

      <!-- 6. نصائح إضافية -->
      <div id="tips">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">💡</span>
          ٦. نصائح إضافية عشان تطلب صح من أول مرة
        </h2>
        <div class="bg-rose-gold/5 rounded-xl p-5 border border-rose-gold/20">
          <ul class="space-y-3">
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اقرأ جدول المقاسات</strong> - كل منتج وله جدول مقاسات خاص بيه</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اقرأ التقييمات</strong> - شوف الناس اللي زيك في الطول والوزن قالوا إيه</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اتفرج على فيديو المنتج</strong> - لو فيه فيديو للموديل، هتفهم شكل المقاس</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اسأل خدمة العملاء</strong> - في VELIX فريقنا موجود على واتساب عشان يساعدك</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold text-xl">✓</span> <strong>اطلب مقاسين وجربهم</strong> - لو مش متأكد، اطلب الاتنين وارجع اللي مش مناسبك</li>
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
          <span className="text-rose-gold font-bold">دليل المقاسات الكامل</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">📏 دليل مقاسات</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 10 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            دليل المقاسات الكامل - ازاي تختار المقاس المناسب لأي قطعة ملابس
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🔄</div>
          <p className="text-rose-gold font-black text-xl mb-3">لو غلطت في المقاس، عندك ١٤ يوم تستبدل</p>
          <p className="text-black/70 font-bold mb-6">في VELIX، عندك <strong className="text-rose-gold">١٤ يوم كاملين</strong> من يوم الاستلام تقرر إنك عايز تستبدل المنتج. الاستبدال مجاني بالكامل.</p>
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
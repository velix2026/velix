// app/blog/دليل-المقاسات-الكامل-ازاي-تختار-المقاس-المناسب/SizeGuideClient.tsx
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
          <li><a href="#common-sizes" class="text-rose-gold hover:underline">٥. المقاسات الأكتر شيوعاً عند المصريين</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٦. أخطاء شائعة في اختيار المقاس</a></li>
          <li><a href="#online-tips" class="text-rose-gold hover:underline">٧. ازاي تطلب أونلاين من غير ما تغلط</a></li>
        </ul>
      </div>

      <!-- 1. الأدوات -->
      <div id="tools">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">1</span><h2 class="text-2xl md:text-3xl font-black text-black">الأدوات اللي هتحتاجها عشان تقيس نفسك صح</h2></div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">📏</span><div><p class="font-black text-black">شريط قياس (متر قماش)</p><p class="text-xs text-black/60">موجود في أي مكتبة بـ ١٠-٢٠ جنيه</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">🪞</span><div><p class="font-black text-black">مراية كبيرة</p><p class="text-xs text-black/60">عشان تشوف نفسك وأماكن القياس</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">📝</span><div><p class="font-black text-black">ورقة وقلم</p><p class="text-xs text-black/60">عشان تكتب المقاسات عشان ماتنساش</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">👥</span><div><p class="font-black text-black">مساعدة من حد (اختياري)</p><p class="text-xs text-black/60">لو في حد يساعدك هيبقي أسهل</p></div></div>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 mt-4 border border-amber-200">
          <p class="text-amber-700 font-bold text-sm flex items-center gap-2">💡 <span>نصيحة مهمة: خليك لابس حاجة خفيفة زي التيشرت الداخلي وقت القياس عشان النتيجة تكون مضبوطة. متقيسش وأنا لابس هودي أو جاكيت.</span></p>
        </div>
      </div>

      <!-- 2. ازاي تقيس جسمك -->
      <div id="measure">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">2</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تقيس جسمك خطوة بخطوة</h2></div>
        
        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">أ.</span> محيط الصدر (Chest)</h3>
          <p class="text-black/70 font-bold mb-3">ده أهم قياس للتيشرتات والهوديز.</p>
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

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">د.</span> محيط الخصر (Waist)</h3>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> لف شريط القياس حوالين أنحف جزء في خصرك</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> متشدش البطن ولا تسترخي أوي، خليك طبيعي</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20">
          <h3 class="text-xl font-black text-black mb-3 flex items-center gap-2"><span class="text-rose-gold">هـ.</span> طول الدراع (Sleeve Length)</h3>
          <ul class="space-y-2 mr-4">
            <li class="flex items-start gap-2"><span class="text-rose-gold">1️⃣</span> ابدأ من طرف كتفك (نفس نقطة قياس عرض الكتف)</li>
            <li class="flex items-start gap-2"><span class="text-rose-gold">2️⃣</span> انزل بدراعك لحد معصمك</li>
          </ul>
        </div>

        <div class="bg-rose-gold/5 rounded-xl p-4 mt-4 border border-rose-gold/20">
          <p class="text-rose-gold font-black text-sm">📝 جدول تسجيل المقاسات:</p>
          <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div class="font-bold">محيط الصدر:</div><div class="border-b border-rose-gold/30">_____ سم</div>
            <div class="font-bold">طول الجسم:</div><div class="border-b border-rose-gold/30">_____ سم</div>
            <div class="font-bold">عرض الكتف:</div><div class="border-b border-rose-gold/30">_____ سم</div>
            <div class="font-bold">محيط الخصر:</div><div class="border-b border-rose-gold/30">_____ سم</div>
            <div class="font-bold">طول الدراع:</div><div class="border-b border-rose-gold/30">_____ سم</div>
          </div>
        </div>
      </div>

      <!-- 3. جدول المقاسات -->
      <div id="table">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">3</span><h2 class="text-2xl md:text-3xl font-black text-black">جدول المقاسات العالمي مقابل المقاسات العربية</h2></div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead><tr class="bg-rose-gold/10"><th class="border p-3 text-center font-black">المقاس</th><th class="border p-3 text-center font-black">العربي</th><th class="border p-3 text-center font-black">الصدر (سم)</th><th class="border p-3 text-center font-black">الطول (سم)</th></tr></thead>
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
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">4</span><h2 class="text-2xl md:text-3xl font-black text-black">مقاسات المنتجات المختلفة</h2></div>
        
        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3">👕 التيشرتات حسب القصة (Fit):</h3>
          <ul class="space-y-2">
            <li><strong class="text-rose-gold">Slim Fit (ضيق):</strong> بيناسب الجسم النحيف، بيبين العضلات ويعطي شكل أنحف</li>
            <li><strong class="text-rose-gold">Regular Fit (عادي):</strong> المقاس الأكتر انتشاراً، بيناسب كل الأجسام</li>
            <li><strong class="text-rose-gold">Oversize (واسع):</strong> الموضة دلوقتي، بيدي شكل كاجوال وعصري ويخفي العيوب</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <h3 class="text-xl font-black text-black mb-3">🧥 الهوديز:</h3>
          <ul class="space-y-2">
            <li>الهوديز بتكون <strong class="text-rose-gold">أكبر من التيشرتات بنفس المقاس</strong> بحوالي ٢-٣ سم</li>
            <li>لو عايز هودي مريح، خد نفس مقاس التيشرت</li>
            <li>لو عايز هودي أوفر سايز، خد مقاس أكبر بدرجة</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20">
          <h3 class="text-xl font-black text-black mb-3">👖 الشروال:</h3>
          <ul class="space-y-2">
            <li>المقاس بيعتمد على <strong class="text-rose-gold">محيط الخصر</strong> مش محيط الصدر</li>
            <li>خد قياس محيط خصرك زود عليه ٥-١٠ سم عشان يبقى مريح</li>
          </ul>
        </div>
      </div>

      <!-- 5. المقاسات الأكتر شيوعاً عند المصريين -->
      <div id="common-sizes">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">5</span><h2 class="text-2xl md:text-3xl font-black text-black">المقاسات الأكتر شيوعاً عند المصريين</h2></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-2xl font-black text-rose-gold">M</div><div class="text-xs">وسط</div><div class="text-xs text-black/50">الطول: 165-175</div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-2xl font-black text-rose-gold">L</div><div class="text-xs">كبير</div><div class="text-xs text-black/50">الطول: 170-180</div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-2xl font-black text-rose-gold">XL</div><div class="text-xs">كبير جداً</div><div class="text-xs text-black/50">الطول: 175-185</div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20"><div class="text-2xl font-black text-rose-gold">2XL</div><div class="text-xs">كبير جداً 2</div><div class="text-xs text-black/50">الطول: 180-190</div></div>
        </div>
      </div>

      <!-- 6. أخطاء شائعة -->
      <div id="mistakes">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">6</span><h2 class="text-2xl md:text-3xl font-black text-black">أخطاء شائعة في اختيار المقاس</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> تخد مقاس أصغر عشان "أخس" - التيشرت الضيق أوي مش شيك</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> متقارنش مقاسك بمقاس صاحبك - كل جسم مختلف</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> تخد مقاس أكبر عشان "تكون مريح" - التيشرت الواسع أوي مش مريح</div>
          <div class="flex items-center gap-2 p-2 bg-red-50 rounded-lg"><span class="text-red-500">✗</span> تنسى تقيس نفسك تاني - جسمك بيتغير مع الوقت</div>
        </div>
      </div>

      <!-- 7. ازاي تطلب أونلاين -->
      <div id="online-tips">
        <div class="flex items-center gap-3 mb-3"><span class="text-3xl bg-rose-gold/10 w-10 h-10 rounded-full flex items-center justify-center">7</span><h2 class="text-2xl md:text-3xl font-black text-black">ازاي تطلب أونلاين من غير ما تغلط</h2></div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-2"><span class="text-green-600">✓</span> اقرأ جدول المقاسات الخاص بكل منتج</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-600">✓</span> اقرأ التقييمات وشوف الناس اللي زيك في الطول والوزن</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-600">✓</span> اسأل خدمة العملاء (فريق VELIX موجود على واتساب)</div>
          <div class="flex items-center gap-2 p-2"><span class="text-green-600">✓</span> لو مش متأكد، اطلب مقاسين وجربهم في البيت</div>
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
            <span className="text-xs text-black/40">⏱️ 12 دقيقة قراية</span>
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
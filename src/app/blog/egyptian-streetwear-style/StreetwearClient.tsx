// app/blog/ازاي-تنسق-الستريت-وير-المصري/StreetwearClient.tsx
'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function StreetwearClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = "ازاي تنسق الستريت وير المصري؟";
    const text = "5 ستايلات جامدة للستريت وير المصري - دليل كامل من VELIX";
    
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
        <p class="text-lg font-bold text-black/80 leading-relaxed">"الستريت وير بقى الترند الأكبر في مصر، بس ازاي تلبسه بشكل يليق بيك ويعكس شخصيتك من غير ما تبقى كوبي بيست من اللي على السوشيال ميديا؟"</p>
        <p class="text-black/70 font-bold mt-3 leading-relaxed">في المقال ده، هتعرف <strong class="text-rose-gold">إزاي تنسق الستريت وير المصري</strong> زي المحترفين. هقولك 5 ستايلات مختلفة، القطع الأساسية، ونصائح عشان تبقى شيك ومش "كوبي بيست".</p>
      </div>

      <!-- جدول المحتويات -->
      <div class="bg-white rounded-2xl p-5 border border-rose-gold/20 shadow-sm">
        <p class="font-black text-black mb-3 flex items-center gap-2">📑 <span class="text-rose-gold">في المقال ده:</span></p>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li><a href="#what-is" class="text-rose-gold hover:underline">١. إيه هو الستريت وير؟</a></li>
          <li><a href="#basics" class="text-rose-gold hover:underline">٢. القطع الأساسية في الستريت وير المصري</a></li>
          <li><a href="#styles" class="text-rose-gold hover:underline">٣. 5 ستايلات ستريت وير مصرية جامدة</a></li>
          <li><a href="#tips" class="text-rose-gold hover:underline">٤. نصائح عشان تبقى شيك ومش "كوبي بيست"</a></li>
          <li><a href="#mistakes" class="text-rose-gold hover:underline">٥. أخطاء شائعة في الستريت وير المصري</a></li>
        </ul>
      </div>

      <!-- 1. إيه هو الستريت وير -->
      <div id="what-is">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🌎</span>
          ١. إيه هو الستريت وير؟
        </h2>
        <p class="text-black/70 font-bold leading-relaxed">الستريت وير هو ستايل اللبس اللي بدأ من شوارع نيويورك ولوس أنجلوس، وانتشر في كل العالم. بيعتمد على <strong class="text-rose-gold">الراحة والطابع الكاجوال</strong>، مع لمسات من ثقافة الشباب (سكيت، راب، فن الشارع).</p>
        <div class="bg-rose-gold/5 rounded-xl p-4 mt-3 border border-rose-gold/20">
          <p class="font-black text-black">🇪🇬 في مصر، الستريت وير بقى له طابع خاص بيه. بيمزج بين <strong class="text-rose-gold">الأصالة المصرية</strong> واللمسة العصرية. الهودي بقى قطعة أساسية في كل دولاب شاب مصري.</p>
        </div>
      </div>

      <!-- 2. القطع الأساسية -->
      <div id="basics">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">👕</span>
          ٢. القطع الأساسية في الستريت وير المصري
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">🧥</span><div><p class="font-black text-black">الهودي (Hoodie)</p><p class="text-sm text-black/60">أهم قطعة. لو معندكش هودي، مش ستريت وير</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">👕</span><div><p class="font-black text-black">التيشرت الأوفر سايز</p><p class="text-sm text-black/60">يفضل يكون سادة أو برسومات بسيطة</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">👖</span><div><p class="font-black text-black">الشروال الرياضي (Joggers)</p><p class="text-sm text-black/60">مريح وعملي</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">🎒</span><div><p class="font-black text-black">البنطلون الكارجو (Cargo)</p><p class="text-sm text-black/60">فيه جيوب كتير، بيدي شكل عسكري كاجوال</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">🧢</span><div><p class="font-black text-black">الكاب أو الطاقية</p><p class="text-sm text-black/60">بتكمل الشكل</p></div></div>
          <div class="bg-white rounded-xl p-4 border border-rose-gold/20 flex items-center gap-3"><span class="text-3xl">👟</span><div><p class="font-black text-black">الحذاء الرياضي (Sneakers)</p><p class="text-sm text-black/60">يفضل يكون نضيف ومميز</p></div></div>
        </div>
      </div>

      <!-- 3. 5 ستايلات -->
      <div id="styles">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">🔥</span>
          ٣. 5 ستايلات ستريت وير مصرية جامدة
        </h2>
        
        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <div class="flex items-center gap-2 mb-3"><span class="text-3xl">😎</span><h3 class="text-xl font-black text-black">الستايل الأول: الكاجوال اليومي</h3></div>
          <p class="text-black/60 mb-2">المناسب للجامعة أو الخروجات العادية:</p>
          <ul class="space-y-1 text-sm">
            <li>• هودي بلون محايد (أسود، رمادي، بيج)</li>
            <li>• شروال رياضي أو جينز مريح</li>
            <li>• حذاء رياضي أبيض</li>
            <li>• كاب بيسبول</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <div class="flex items-center gap-2 mb-3"><span class="text-3xl">📏</span><h3 class="text-xl font-black text-black">الستايل الثاني: الأوفر سايز (المودرن)</h3></div>
          <p class="text-black/60 mb-2">الترند الأكبر دلوقتي:</p>
          <ul class="space-y-1 text-sm">
            <li>• تيشرت أوفر سايز (ممكن يكون عليه جرافيك)</li>
            <li>• هودي أوفر سايز من فوق (لو جو بارد)</li>
            <li>• شروال واسع أو كارجو واسع</li>
            <li>• حذاء رياضي ضخم (Chunky Sneakers)</li>
            <li>• طاقية صوف (Beanie)</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <div class="flex items-center gap-2 mb-3"><span class="text-3xl">🏃</span><h3 class="text-xl font-black text-black">الستايل الثالث: الرياضي (Sporty)</h3></div>
          <p class="text-black/60 mb-2">للجيم أو الخروجات الرياضية:</p>
          <ul class="space-y-1 text-sm">
            <li>• تيشرت رياضي (قطن بوليستر)</li>
            <li>• شروال رياضي قصير أو طويل</li>
            <li>• حذاء رياضي خفيف</li>
            <li>• جاكيت رياضي خفيف</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20 mb-4">
          <div class="flex items-center gap-2 mb-3"><span class="text-3xl">👔</span><h3 class="text-xl font-black text-black">الستايل الرابع: الليجر (Smart Street)</h3></div>
          <p class="text-black/60 mb-2">للسهرات أو الخروجات شبه الرسمية:</p>
          <ul class="space-y-1 text-sm">
            <li>• تيشرت أسود ضيق (Slim Fit)</li>
            <li>• هودي أسود أو كحلي</li>
            <li>• بنطلون شمبان (Chinos) أو جينز غامق</li>
            <li>• حذاء جلدي رياضي (Jordan, Air Force 1)</li>
          </ul>
        </div>

        <div class="bg-white rounded-xl p-5 border border-rose-gold/20">
          <div class="flex items-center gap-2 mb-3"><span class="text-3xl">☀️</span><h3 class="text-xl font-black text-black">الستايل الخامس: الصيفي (Summer Street)</h3></div>
          <p class="text-black/60 mb-2">للأيام الحارة:</p>
          <ul class="space-y-1 text-sm">
            <li>• تيشرت قطن أبيض أو فاتح</li>
            <li>• شورت رياضي أو كارجو قصير</li>
            <li>• صندل رياضي أو حذاء خفيف</li>
            <li>• كاب لحماية الوش من الشمس</li>
          </ul>
        </div>
      </div>

      <!-- 4. نصائح -->
      <div id="tips">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">💡</span>
          ٤. نصائح عشان تبقى شيك ومش "كوبي بيست"
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">خلي عندك قطعة مميزة</strong><p class="text-sm">خلي في قطعة واحدة مميزة (هودي بلون جريء، حذاء نادر) والباقي يكون بسيط</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">اعرف جسمك</strong><p class="text-sm">مش كل ستايل يناسب كل الأجسام. الأوفر سايز بيناسب النحيف والمتوسط</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">خلي الستايل مريح</strong><p class="text-sm">لو مش مرتاح في لبسك، مش هتبقى شيك. الراحة أهم حاجة</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">الإكسسوارات بتفرق</strong><p class="text-sm">سلسلة، ساعة، كاب، حزام - التفاصيل الصغيرة بتعمل فرق كبير</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"><span class="text-green-500 text-xl">✓</span><div><strong class="font-black">الوش والنضافة</strong><p class="text-sm">أي ستايل من غير وش نضيف وشعر مرتب مش هيكتمل</p></div></div>
        </div>
      </div>

      <!-- 5. أخطاء شائعة -->
      <div id="mistakes">
        <h2 class="text-2xl md:text-3xl font-black text-black mb-4 flex items-center gap-3">
          <span class="text-rose-gold text-3xl">⚠️</span>
          ٥. أخطاء شائعة في الستريت وير المصري (اتجنبها!)
        </h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تقليد الأجانب بدون تعديل</strong><p class="text-sm">اللي بيناسب المناخ البارد مش شرط يناسب مصر الحارة</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تلبس ماركات تقليد</strong><p class="text-sm">باين ومش شيك. البس حاجات بسيطة بس أصلية أحسن</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تهمل النضافة</strong><p class="text-sm">الحذاء الوسخ والهودي المتجعد بيبوظ أي ستايل</p></div></div>
          <div class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200"><span class="text-red-500 text-xl">✗</span><div><strong class="font-black">تحط حاجات كتير مرة واحدة</strong><p class="text-sm">خلي في قطعة واحدة فيها "شو" والباقي يكون هادي</p></div></div>
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
          <span className="text-rose-gold font-bold">ازاي تنسق الستريت وير المصري</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">👔 ستايل</span>
            <span className="text-xs text-black/40">📅 15 أبريل 2026</span>
            <span className="text-xs text-black/40">⏱️ 8 دقايق قراية</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">
            ازاي تنسق الستريت وير المصري؟ 5 ستايلات جامدة
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold prose-a:text-rose-gold">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA Section */}
        <div className="mt-8 bg-rose-gold/10 rounded-2xl p-8 text-center border border-rose-gold/20">
          <div className="text-5xl mb-4">🔥</div>
          <p className="text-rose-gold font-black text-xl mb-3">جهز ستايل الستريت وير بتاعك من VELIX</p>
          <p className="text-black/70 font-bold mb-6">تيشرتات، هوديز، شروال - كل اللي محتاجه عشان تبقى شيك. قطن مصري ١٠٠٪ وشحن مجاني لكل مصر.</p>
          <Link 
            href="/products" 
            className="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
          >
            🛒 تسوق الستريت وير دلوقتي
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
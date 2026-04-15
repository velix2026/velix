// app/blog/posts-data.ts
export const posts = [
  // المقالة 1 - دليل المقاسات الكامل
  {
    slug: "complete-size-guide",
    title: "دليل المقاسات الكامل | ازاي تختار المقاس المناسب",
    excerpt: "دليل شامل لقياس الجسم واختيار المقاس المناسب للتيشرتات والهوديز والشروال. جدول مقاسات ونصائح عملية.",
    content: `
      <div class="space-y-8">
        <div class="bg-rose-gold/5 rounded-2xl p-6 border border-rose-gold/20">
          <p class="text-lg font-bold text-black/80 leading-relaxed">"طلبت تيشرت أونلاين ولما وصل كان ضيق عليا؟" أو "الهودي طلع واسع أوي مش زي ما كنت متخيل؟"</p>
          <p class="text-black/70 font-bold mt-3 leading-relaxed">المشكلة دي بتحصل مع ناس كتير، والسبب الرئيسي إنهم <strong class="text-rose-gold">ميعرفوش يقيسوا نفسهم صح</strong> أو مش فاهمين <strong class="text-rose-gold">جدول المقاسات</strong>.</p>
        </div>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">🛠️ ١. الأدوات اللي هتحتاجها</h2>
        <ul class="list-none space-y-2">
          <li class="flex items-start gap-2"><span class="text-rose-gold">✓</span> <strong>شريط قياس (متر قماش)</strong> - موجود في أي مكتبة</li>
          <li class="flex items-start gap-2"><span class="text-rose-gold">✓</span> <strong>مراية كبيرة</strong> - عشان تشوف نفسك</li>
          <li class="flex items-start gap-2"><span class="text-rose-gold">✓</span> <strong>ورقة وقلم</strong> - عشان تكتب المقاسات</li>
        </ul>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">📏 ٢. ازاي تقيس نفسك خطوة بخطوة</h2>
        
        <h3 class="text-xl font-black text-black mt-6 mb-3">أ. محيط الصدر (Chest)</h3>
        <p>ده أهم قياس للتيشرتات والهوديز:</p>
        <ul>
          <li>لف شريط القياس حوالين أعرض جزء في صدرك (تحت الإبط بشوية)</li>
          <li>خلي الشريط مستوي ومش مائل</li>
          <li>متشدش الشريط أوي ولا تخليه فضفاض</li>
          <li>اتنفس طبيعي ومتحبسش نفسك</li>
        </ul>

        <h3 class="text-xl font-black text-black mt-6 mb-3">ب. طول الجسم (Length)</h3>
        <ul>
          <li>ابدأ من أعلى نقطة في كتفك (عند الرقبة)</li>
          <li>انزل بشريط القياس لحد ما توصل للمكان اللي عايز التيشرت يوصل له</li>
          <li>لأغلب الناس، التيشرت بيوصل لنص البنطلون أو تحت الخصر بشوية</li>
        </ul>

        <h3 class="text-xl font-black text-black mt-6 mb-3">ج. عرض الكتف (Shoulder Width)</h3>
        <ul>
          <li>قس المسافة بين طرف كتفك الأيمن وطرف كتفك الأيسر</li>
          <li>خلي شريط القياس مستوي على ضهرك</li>
        </ul>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">📊 ٣. جدول المقاسات العالمي</h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead><tr class="bg-rose-gold/10"><th class="border p-3">المقاس</th><th class="border p-3">العربي</th><th class="border p-3">الصدر (سم)</th><th class="border p-3">الطول (سم)</th></tr></thead>
            <tbody>
              <tr><td class="border p-3 text-center">XS</td><td class="border p-3 text-center">صغير جداً</td><td class="border p-3 text-center">86-91</td><td class="border p-3 text-center">66-68</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center">S</td><td class="border p-3 text-center">صغير</td><td class="border p-3 text-center">91-96</td><td class="border p-3 text-center">68-70</td></tr>
              <tr><td class="border p-3 text-center">M</td><td class="border p-3 text-center">وسط</td><td class="border p-3 text-center">96-101</td><td class="border p-3 text-center">70-72</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center">L</td><td class="border p-3 text-center">كبير</td><td class="border p-3 text-center">101-106</td><td class="border p-3 text-center">72-74</td></tr>
              <tr><td class="border p-3 text-center">XL</td><td class="border p-3 text-center">كبير جداً</td><td class="border p-3 text-center">106-111</td><td class="border p-3 text-center">74-76</td></tr>
              <tr class="bg-rose-gold/5"><td class="border p-3 text-center">2XL</td><td class="border p-3 text-center">كبير جداً 2</td><td class="border p-3 text-center">111-116</td><td class="border p-3 text-center">76-78</td></tr>
              <tr><td class="border p-3 text-center">3XL</td><td class="border p-3 text-center">كبير جداً 3</td><td class="border p-3 text-center">116-121</td><td class="border p-3 text-center">78-80</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-rose-gold/10 rounded-2xl p-6 my-8 text-center border border-rose-gold/20">
          <p class="text-rose-gold font-black text-lg mb-2">💡 نصيحة من VELIX</p>
          <p class="text-black/70 font-bold mb-4">عندنا في VELIX تشكيلة متنوعة بكل المقاسات والألوان. قطن مصري ١٠٠٪ وشحن مجاني لكل مصر.</p>
          <Link href="/products" class="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition">تسوق دلوقتي</Link>
        </div>
      </div>
    `,
    date: "2026-04-20",
    readTime: "8 دقايق",
    category: "دليل مقاسات",
    categoryIcon: "📏",
    categoryColor: "bg-blue-100 text-blue-700",
    imageBg: "from-blue-100 to-blue-50",
    tags: ["مقاسات", "دليل", "تيشرتات", "هوديز"],
  },
  // المقالة 2 - ازاي تختار التيشرت المناسب
  {
    slug: "how-to-choose-right-tshirt",
    title: "ازاي تختار التيشرت المناسب ليك؟ دليل كامل",
    excerpt: "التيشرت هو أساس أي لبس. ازاي تختار اللي يناسب جسمك ولون بشرتك والمناسبة؟ 6 نصائح عملية.",
    content: `
      <div class="space-y-8">
        <div class="bg-rose-gold/5 rounded-2xl p-6 border border-rose-gold/20">
          <p class="text-lg font-bold text-black/80 leading-relaxed">التيشرت هو القطعة الأساسية في أي دولاب. لكن ازاي تختار التيشرت اللي يخليك شيك ومريح في نفس الوقت؟</p>
        </div>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">١. اعرف شكل جسمك أولاً</h2>
        <ul>
          <li><strong>الجسم النحيف:</strong> التيشرتات الـ Slim Fit هتبان عليك حلوة جداً</li>
          <li><strong>الجسم المتوسط:</strong> الـ Regular Fit هيكون أحسن حاجة</li>
          <li><strong>الجسم الممتلئ:</strong> الـ Oversize هيديك شكل أنيق ويخفي العيوب</li>
        </ul>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">٢. اختار المقاس الصح</h2>
        <ul>
          <li>الكتفين يبقوا مظبوطين - الدرز تكون على طرف كتفك بالضبط</li>
          <li>الطول يكون مناسب - يوصل لنص بنطلونك أو شوية أقل</li>
          <li>التيشرت يكون قريب من جسمك لكن مش لاصق فيه</li>
        </ul>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">٣. خلي بالك من الخامة</h2>
        <ul>
          <li><strong>قطن ١٠٠٪:</strong> أفضل حاجة في الصيف</li>
          <li><strong>القطن المصري:</strong> أحسن أنواع القطن. ناعم جداً وعمره طويل</li>
        </ul>

        <div class="bg-rose-gold/10 rounded-2xl p-6 my-8 text-center border border-rose-gold/20">
          <p class="text-rose-gold font-black text-lg mb-2">💡 نصيحة من VELIX</p>
          <p class="text-black/70 font-bold mb-4">عندنا في VELIX تشكيلة متنوعة من التيشرتات بكل المقاسات والألوان. كل قطعة قطن مصري ١٠٠٪.</p>
          <Link href="/products?category=تيشرتات" class="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition">تسوق التيشرتات دلوقتي</Link>
        </div>
      </div>
    `,
    date: "2026-04-19",
    readTime: "6 دقايق",
    category: "نصائح",
    categoryIcon: "👕",
    categoryColor: "bg-green-100 text-green-700",
    imageBg: "from-green-100 to-green-50",
    tags: ["تيشرتات", "نصائح", "ستايل"],
  },
  // المقالة 3 - دليل المقاسات للهوديز
  {
    slug: "hoodie-size-guide",
    title: "دليل المقاسات للهوديز | ازاي تختار المقاس الصح",
    excerpt: "الهودي بقى من القطع الأساسية في لبس الشباب. ازاي تختار المقاس المناسب عشان تبقى شيك ومريح؟",
    content: `
      <div class="space-y-8">
        <p>الهودي بقى من القطع الأساسية في لبس الشباب المصري. في الشتاء والصيف، الهودي موجود في كل مكان. ازاي تختار المقاس المناسب؟</p>
        
        <div class="bg-rose-gold/5 rounded-2xl p-6 border border-rose-gold/20">
          <h2 class="text-xl font-black text-black mb-3">📏 الفرق بين مقاسات الهودي والتيشرت</h2>
          <p class="font-bold">الهوديز بتكون <strong class="text-rose-gold">أكبر من التيشرتات بنفس المقاس</strong> بحوالي ٢-٣ سم في محيط الصدر.</p>
        </div>

        <h2 class="text-2xl md:text-3xl font-black text-black mb-4">إزاي تختار المقاس المناسب</h2>
        <ul>
          <li><strong>لو عايز هودي مريح:</strong> خد نفس مقاس التيشرت بتاعك</li>
          <li><strong>لو عايز هودي أوفر سايز:</strong> خد مقاس أكبر بدرجة من مقاسك الطبيعي</li>
          <li><strong>لو عايز هودي تحت جاكيت:</strong> خد مقاس أصغر بدرجة</li>
        </ul>

        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center border border-rose-gold/20">
          <p class="text-rose-gold font-black text-lg mb-2">🔥 هوديز VELIX</p>
          <p class="text-black/70 font-bold mb-4">هوديز شتوية تقيلة وخامات صيفية خفيفة. كل المقاسات من S لـ 3XL.</p>
          <Link href="/products?category=هوديز" class="inline-block bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition">تسوق الهوديز دلوقتي</Link>
        </div>
      </div>
    `,
    date: "2026-04-18",
    readTime: "5 دقايق",
    category: "دليل مقاسات",
    categoryIcon: "📏",
    categoryColor: "bg-blue-100 text-blue-700",
    imageBg: "from-blue-100 to-blue-50",
    tags: ["هوديز", "مقاسات", "شتوي"],
  },
  // المقالة 4 - ازاي تحافظ على ملابسك
  {
    slug: "how-to-care-for-clothes",
    title: "ازاي تحافظ على ملابسك لأطول فترة؟ 10 نصائح ذهبية",
    excerpt: "عايز ملابسك تفضل زي الجديدة لسنين؟ اتبع النصائح دي في الغسيل والتخزين والكي.",
    content: `
      <div class="space-y-8">
        <div class="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p class="text-amber-700 font-bold text-sm">💡 الملابس مش بتتغير بس عشان قديمة، كتير بتتغير عشان إحنا منعرفش نعتني بيها صح.</p>
        </div>
        <h2 class="text-2xl font-black text-black">١. اقرأ تعليمات الغسيل على البطاقة</h2>
        <ul><li>🧼 الحوض وفيه رقم: أقصى درجة حرارة للغسيل</li><li>🫗 الإيد في الحوض: لازم تغسل باليد</li><li>🔴 الدائرة المثلث: مينفعش تستخدم مبيض</li></ul>
        <h2 class="text-2xl font-black text-black">٢. افصل الألوان قبل الغسيل</h2>
        <ul><li><strong>الأبيض مع الأبيض</strong></li><li><strong>الفاتح مع الفاتح</strong></li><li><strong>الغامق مع الغامق</strong></li></ul>
        <h2 class="text-2xl font-black text-black">٣. اختار درجة حرارة مناسبة</h2>
        <ul><li><strong>٣٠ درجة:</strong> للتيشرتات والهوديز</li><li><strong>٤٠ درجة:</strong> للملابس الداخلية</li><li><strong>٦٠ درجة:</strong> للبياضات</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-17",
    readTime: "7 دقايق",
    category: "عناية",
    categoryIcon: "🧼",
    categoryColor: "bg-purple-100 text-purple-700",
    imageBg: "from-purple-100 to-purple-50",
    tags: ["عناية", "غسيل", "تخزين"],
  },
  // المقالة 5 - الفرق بين القطن المصري والقطن العادي
  {
    slug: "egyptian-cotton-vs-regular",
    title: "الفرق بين القطن المصري والقطن العادي | ليه القطن المصري الأحسن؟",
    excerpt: "القطن المصري مشهور في كل العالم. ليه هو الأحسن؟ وايه الفرق بينه وبين القطن العادي؟",
    content: `
      <div class="space-y-8">
        <div class="bg-rose-gold/5 rounded-2xl p-6"><p>القطن المصري من أفضل أنواع القطن في العالم. خيوطه أطول وناعمة أكتر، بتدي قماش فاخر ومريح.</p></div>
        <h2 class="text-2xl font-black">الفرق بين القطن المصري والقطن العادي</h2>
        <ul><li><strong>طول التيلة:</strong> القطن المصري طويل جداً (٣٥-٤٠ ملم) vs القطن العادي قصير (٢٠-٢٥ ملم)</li>
        <li><strong>النعومة:</strong> القطن المصري ناعم جداً vs القطن العادي خشن شوية</li>
        <li><strong>المتانة:</strong> القطن المصري بيعيش لسنين vs القطن العادي بيتآكل بسرعة</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق القطن المصري دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-16",
    readTime: "5 دقايق",
    category: "خامات",
    categoryIcon: "🧵",
    categoryColor: "bg-amber-100 text-amber-700",
    imageBg: "from-amber-100 to-amber-50",
    tags: ["قطن مصري", "خامات", "جودة"],
  },
  // المقالة 6 - ازاي تنسق الستريت وير المصري
  {
    slug: "egyptian-streetwear-style",
    title: "ازاي تنسق الستريت وير المصري؟ 5 ستايلات جامدة",
    excerpt: "الستريت وير بقى ترند في مصر. ازاي تلبسه بشكل يليق بيك ويعكس شخصيتك؟",
    content: `
      <div class="space-y-8">
        <p>الستريت وير بقى الترند الأكبر في مصر. في المقال ده هتعرف ازاي تلبسه بشكل يليق بيك.</p>
        <h2 class="text-2xl font-black">القطع الأساسية في الستريت وير المصري</h2>
        <ul><li>الهودي - أهم قطعة</li><li>التيشرت الأوفر سايز</li><li>الشروال الرياضي</li><li>الكاب أو الطاقية</li><li>الحذاء الرياضي</li></ul>
        <h2 class="text-2xl font-black">5 ستايلات ستريت وير مصرية</h2>
        <ul><li><strong>الكاجوال اليومي:</strong> هودي بلون محايد + شروال رياضي</li>
        <li><strong>الأوفر سايز:</strong> تيشرت أوفر سايز + هودي أوفر سايز</li>
        <li><strong>الرياضي:</strong> تيشرت رياضي + شروال قصير</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق الستريت وير دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-15",
    readTime: "6 دقايق",
    category: "ستايل",
    categoryIcon: "👔",
    categoryColor: "bg-pink-100 text-pink-700",
    imageBg: "from-pink-100 to-pink-50",
    tags: ["ستريت وير", "تنسيق ملابس", "ستايل"],
  },
  // المقالة 7 - أنواع الأقمشة
  {
    slug: "fabric-types-guide",
    title: "أنواع الأقمشة الكامل | دليل اختيار القماش المناسب",
    excerpt: "دليل شامل لأنواع الأقمشة: قطن، بوليستر، صوف، حرير، دنيم. مميزات وعيوب كل نوع.",
    content: `
      <div class="space-y-8">
        <p>مش كل الأقمشة زي بعض. اختيار القماش المناسب بيفرق في الراحة والشكل.</p>
        <h2 class="text-2xl font-black">١. القطن (Cotton)</h2>
        <ul><li><strong>المميزات:</strong> ناعم، بيدخل هوا، بيمتص العرق</li><li><strong>العيوب:</strong> بيتجعد بسرعة</li></ul>
        <h2 class="text-2xl font-black">٢. البوليستر (Polyester)</h2>
        <ul><li><strong>المميزات:</strong> متين، بيتجعد قليل، سعره رخيص</li><li><strong>العيوب:</strong> مش بيدخل هوا، بيسخن في الصيف</li></ul>
        <h2 class="text-2xl font-black">٣. القطن المصري</h2>
        <ul><li>أفضل أنواع القطن، ناعم جداً، بيعيش لسنين</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق القطن المصري دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-14",
    readTime: "7 دقايق",
    category: "خامات",
    categoryIcon: "🧵",
    categoryColor: "bg-amber-100 text-amber-700",
    imageBg: "from-amber-100 to-amber-50",
    tags: ["أقمشة", "قطن", "بوليستر"],
  },
  // المقالة 8 - ازاي تغسل الهودي والتيشرت
  {
    slug: "how-to-wash-hoodie-tshirt",
    title: "ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد",
    excerpt: "دليل كامل لغسيل الهوديز والتيشرتات. ازاي تغسل، ازاي تنشف، ازاي تكوي.",
    content: `
      <div class="space-y-8">
        <div class="bg-red-50 rounded-xl p-4"><p class="text-red-700 font-black">⚠️ متحطش الهودي في النشافة (المجفف)! النشافة بتقلص حجم الهودي وتضعف الألياف.</p></div>
        <h2 class="text-2xl font-black">ازاي تغسل الهودي صح</h2>
        <ul><li>اقلبه على الوجه التاني</li><li>استخدم ماية ساقعة (٣٠ درجة)</li><li>متستخدمش مبيض</li></ul>
        <h2 class="text-2xl font-black">ازاي تنشف الهودي</h2>
        <ul><li>انشر الهودي في الهوا</li><li>بعيد عن الشمس المباشرة</li><li>استخدم شماعة عريضة</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-13",
    readTime: "6 دقايق",
    category: "عناية",
    categoryIcon: "🧼",
    categoryColor: "bg-purple-100 text-purple-700",
    imageBg: "from-purple-100 to-purple-50",
    tags: ["غسيل", "هوديز", "تيشرتات"],
  },
  // المقالة 9 - ازاي تختار هدية من الملابس
  {
    slug: "clothing-gift-guide",
    title: "ازاي تختار هدية من الملابس لحد بتحبه؟ دليل الهدايا المثالية",
    excerpt: "عايز تهدي حد هدية من الملابس ومش عارف تختار؟ هنقولك ازاي تختار الهدية الصح.",
    content: `
      <div class="space-y-8">
        <p>عايز تهدي حد هدية من الملابس ومش عارف تختار؟ المقال ده هيديك دليل كامل.</p>
        <h2 class="text-2xl font-black">ازاي تعرف المقاس من غير ما تسأل؟</h2>
        <ul><li>شوف هدومه اللي بيلبسها</li><li>اسأل صاحبه أو أمه</li><li>خد مقاس L أو XL (الأكتر انتشاراً)</li></ul>
        <h2 class="text-2xl font-black">أفكار هدايا من الملابس</h2>
        <ul><li>التيشرت الأبيض أو الأسود - بيناسب أي حد</li><li>الهودي - بقى من القطع الأساسية</li><li>الشروال الرياضي - مريح وعملي</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">اشتري هدية دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-12",
    readTime: "5 دقايق",
    category: "هدايا",
    categoryIcon: "🎁",
    categoryColor: "bg-red-100 text-red-700",
    imageBg: "from-red-100 to-red-50",
    tags: ["هدايا", "مناسبات"],
  },
  // المقالة 10 - نصائح للتسوق أونلاين في مصر
  {
    slug: "online-shopping-tips-egypt",
    title: "نصائح التسوق أونلاين في مصر | ازاي تشتري من النت من غير وجع دماغ",
    excerpt: "ازاي تشتري من النت من غير وجع دماغ؟ ازاي تتأكد من جودة المنتج؟ وايه حقوقك كعميل؟",
    content: `
      <div class="space-y-8">
        <p>كتير من الناس لسه خايفة تشتري أونلاين. المقال ده هيخليك تشتري من النت من غير وجع دماغ.</p>
        <h2 class="text-2xl font-black">اتأكد إن الموقع موثوق</h2>
        <ul><li>شوف التقييمات على فيسبوك وجوجل</li><li>اتأكد إن فيه صفحة "اتصل بنا"</li><li>اقرأ سياسة الاستبدال والاسترجاع</li></ul>
        <h2 class="text-2xl font-black">ازاي تتأكد من جودة المنتج</h2>
        <ul><li>اقرأ وصف المنتج كويس</li><li>اتفرج على صور المنتج من كل الزوايا</li><li>اقرأ تقييمات العملاء</li></ul>
        <h2 class="text-2xl font-black">الدفع: كاش ولا كريديت كارد؟</h2>
        <ul><li>الدفع عند الاستلام - الأفضل للمبتدئين</li><li>الدفع ببطاقة ائتمانية - أسرع بس اتأكد إن الموقع مشفر</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي من VELIX</Link></div>
      </div>
    `,
    date: "2026-04-11",
    readTime: "6 دقايق",
    category: "تسوق",
    categoryIcon: "🛒",
    categoryColor: "bg-teal-100 text-teal-700",
    imageBg: "from-teal-100 to-teal-50",
    tags: ["تسوق أونلاين", "نصائح", "مصر"],
  },
  // المقالة 11 - ازاي تزيل البقع من الملابس
  {
    slug: "remove-stains-from-clothes",
    title: "ازاي تزيل البقع من الملابس | دليل كامل لتنظيف أي نوع بقع",
    excerpt: "دليل شامل لإزالة البقع: زيت، قهوة، شاي، دم، حبر، وماكياج. طرق طبيعية وكيميائية.",
    content: `
      <div class="space-y-8">
        <div class="bg-amber-50 rounded-xl p-4"><p class="text-amber-700 font-black">⚠️ أسرع ما تبقى البقعة، أسهل إزالتها. متستناش، اشتغل عليها فوراً.</p></div>
        <h2 class="text-2xl font-black">إزالة بقع الزيت والسمن</h2>
        <ul><li>حط بودرة تالك أو نشا على البقعة، استنى ١٠-١٥ دقيقة</li><li>حط شوية سائل غسيل الأطباق على البقعة، افرك بماية ساقعة</li></ul>
        <h2 class="text-2xl font-black">إزالة بقع القهوة والشاي</h2>
        <ul><li>اغسل البقعة بماية ساقعة فوراً، بعدين حط شوية خل أبيض</li></ul>
        <h2 class="text-2xl font-black">إزالة بقع الدم</h2>
        <ul><li>ماياة ساقعة بس! الماية السخنة بتثبت بقعة الدم</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-10",
    readTime: "7 دقايق",
    category: "عناية",
    categoryIcon: "🧼",
    categoryColor: "bg-purple-100 text-purple-700",
    imageBg: "from-purple-100 to-purple-50",
    tags: ["بقع", "تنظيف", "عناية"],
  },
  // المقالة 12 - دليل ألوان الملابس حسب لون البشرة
  {
    slug: "colors-for-skin-tone",
    title: "دليل ألوان الملابس حسب لون البشرة | ازاي تختار اللون اللي يليق بيك",
    excerpt: "ازاي تختار اللون اللي يليق بيك حسب لون بشرتك؟ دليل كامل لاختيار الألوان المناسبة.",
    content: `
      <div class="space-y-8">
        <p>ليه لون معين بيخليني شيك ولون تاني بيخليني بايخ؟ الجواب في لون بشرتك.</p>
        <h2 class="text-2xl font-black">ازاي تعرف لون بشرتك؟</h2>
        <ul><li><strong>البشرة الفاتحة:</strong> بيضا أو قمحاوية فاتحة</li><li><strong>البشرة الحنطية:</strong> الأكتر شيوعاً في مصر</li><li><strong>البشرة السمراء:</strong> بنية غامقة</li></ul>
        <h2 class="text-2xl font-black">أفضل الألوان للبشرة الحنطية (الأكتر شيوعاً)</h2>
        <ul><li>أبيض، رمادي، أزرق سماوي، أحمر، أصفر خردلي، أخضر زيتي</li></ul>
        <h2 class="text-2xl font-black">الألوان اللي تناسب الجميع</h2>
        <ul><li>أسود، أبيض، رمادي، كحلي</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-09",
    readTime: "5 دقايق",
    category: "ستايل",
    categoryIcon: "👔",
    categoryColor: "bg-pink-100 text-pink-700",
    imageBg: "from-pink-100 to-pink-50",
    tags: ["ألوان", "بشرة", "ستايل"],
  },
  // المقالة 13 - دليل المقاسات للمبتدئين
  {
    slug: "size-guide-for-beginners",
    title: "دليل المقاسات للمبتدئين | ازاي تطلب مقاسك الصح من أول مرة",
    excerpt: "لو لسه بتتعلم ازاي تطلب أونلاين، المقالة دي ليك. دليل مبسط لقياس الجسم واختيار المقاس المناسب.",
    content: `
      <div class="space-y-8">
        <p>لو لسه جديد في عالم التسوق أونلاين، المقالة دي ليك. هنعلمك ازاي تطلب مقاسك الصح من أول مرة.</p>
        <h2 class="text-2xl font-black">الأدوات اللي هتحتاجها</h2>
        <ul><li>شريط قياس (متر قماش)</li><li>مراية كبيرة</li><li>ورقة وقلم</li></ul>
        <h2 class="text-2xl font-black">القياسات الأساسية</h2>
        <ul><li><strong>محيط الصدر:</strong> لف الشريط حوالين أعرض جزء في صدرك</li>
        <li><strong>طول الجسم:</strong> من أعلى كتفك للمكان اللي عايز التيشرت يوصل له</li>
        <li><strong>محيط الخصر:</strong> لف الشريط حوالين أنحف جزء في خصرك</li></ul>
        <div class="bg-rose-gold/10 rounded-2xl p-6 text-center"><Link href="/products" class="bg-rose-gold text-white px-6 py-3 rounded-full">تسوق دلوقتي</Link></div>
      </div>
    `,
    date: "2026-04-08",
    readTime: "4 دقايق",
    category: "دليل مقاسات",
    categoryIcon: "📏",
    categoryColor: "bg-blue-100 text-blue-700",
    imageBg: "from-blue-100 to-blue-50",
    tags: ["مقاسات", "مبتدئين", "دليل"],
  },
]
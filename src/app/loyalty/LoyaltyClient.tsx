'use client';

import { motion } from 'framer-motion';
import { toArabicNumber } from '@/lib/utils';
import { TIERS, pointsToEGP } from '@/lib/loyalty';
import LoyaltyCard from '@/components/LoyaltyCard';
import Link from 'next/link';

const tierGradients: Record<string, string> = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-slate-400 to-slate-300',
  gold: 'from-yellow-600 to-yellow-400',
  platinum: 'from-cyan-700 to-cyan-400',
};

const tierIcons: Record<string, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

const faqs = [
  { q: 'إيه هو برنامج ولاء VELIX؟', a: 'برنامج المكافآت بتاعنا بيديك نقاط على كل طلب تطلبه. تقدر تجمع النقاط وتستبدلها بخصم على طلباتك الجاية.' },
  { q: 'النقاط بتتحسب إزاي؟', a: 'كل مستوى ليه مضاعف نقاط معين. البرونزي: ١ نقطة لكل جنيه، الفضي: ١.٢ نقطة، الذهبي: ١.٥ نقطة، البلاتيني: ٢ نقطة لكل جنيه.' },
  { q: 'إزاي أستبدل النقاط؟', a: 'لما تكمل طلبك، هتقدر تدخل رقم تليفونك وتشوف نقاطك. لو معاك ١٠٠ نقطة أو أكتر، تقدر تستبدلهم بخصم. كل ١٠٠ نقطة = ١٠ جنيه خصم.' },
  { q: 'النقاط ليها تاريخ صلاحية؟', a: 'النقاط بتفضل شغالة طول ما انت بتطلب مننا. لو مدتش طلب لمدة سنة، النقاط بتنتهي. فكل ما تطلب، كل ما نقاطك تفضل موجودة.' },
  { q: 'أقدر أشوف نقاطي فين؟', a: 'تقدر تشوف نقاطك من صفحة الولاء دي، أو من خلال صفحة الطلب لما تكمل طلبك. كل اللي عليك تدخل رقم تليفونك.' },
  { q: 'المستويات بتتغير إزاي؟', a: 'المستوى بيتغير حسب إجمالي النقاط اللي معاك. أوتوماتيك، من غير ما تعمل حاجة. كل ما نقاطك تزيد، مستواك بيزيد.' },
];

export default function LoyaltyClient() {
  return (
    <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            VELIX LOYALTY
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-black mb-4">
            برنامج المكافآت
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
          <p className="text-black/60 font-bold max-w-2xl mx-auto">
            كل ما تطلب، كل ما تكسب نقاط. استبدل نقاطك بخصم على طلباتك الجاية.
          </p>
        </div>

        {/* Check your points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-12"
        >
          <LoyaltyCard />
        </motion.div>

        {/* Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-black text-center mb-8">مستويات المكافآت</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIERS.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`bg-white rounded-2xl border border-rose-gold/20 p-5 hover:shadow-md transition-all ${tier.name === 'bronze' ? 'opacity-90' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{tierIcons[tier.name]}</span>
                  <div>
                    <div className={`bg-linear-to-r ${tierGradients[tier.name]} text-transparent bg-clip-text text-lg font-black`}>
                      {tier.nameAr}
                    </div>
                    <div className="text-xs text-black/50 font-bold">
                      {tier.maxPoints === Infinity ? `${toArabicNumber(tier.minPoints)}+ نقطة` : `${toArabicNumber(tier.minPoints)} - ${toArabicNumber(tier.maxPoints)} نقطة`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm font-black text-black">x{tier.multiplier}</span>
                  <span className="text-xs text-black/60 font-bold">نقطة لكل جنيه</span>
                </div>
                <ul className="space-y-1">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-black/70 font-bold">
                      <span className="text-rose-gold shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12 bg-rose-gold/5 rounded-2xl p-6 md:p-8 border border-rose-gold/20">
          <h2 className="text-xl font-black text-black text-center mb-6">إزاي تشتغل؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '١', title: 'اطلب', desc: 'اطلب أي منتج من VELIX عادي' },
              { step: '٢', title: 'اكسب', desc: `بتكسب نقاط على كل جنيه بتصرفه` },
              { step: '٣', title: 'استبدل', desc: `كل ${toArabicNumber(100)} نقطة = ${toArabicNumber(10)} جنيه خصم` },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-black text-black mb-1">{item.title}</h3>
                <p className="text-xs text-black/60 font-bold">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <div className="inline-block bg-white rounded-xl px-4 py-2 border border-rose-gold/20 text-sm font-bold text-black">
              {toArabicNumber(100)} نقطة = {toArabicNumber(10)} جنيه خصم
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-black text-center mb-6">أسئلة شائعة عن المكافآت</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-rose-gold/20 hover:shadow-sm transition-all"
              >
                <h3 className="font-black text-black text-sm mb-1">{faq.q}</h3>
                <p className="text-xs text-black/70 font-bold leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-rose-gold/5 rounded-2xl p-8 border border-rose-gold/20">
          <h3 className="text-xl font-black text-black mb-2">جهز تطلب دلوقتي؟</h3>
          <p className="text-black/60 font-bold mb-4">اطلب دلوقتي وابدأ تجمع نقاط من أول طلب</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/30"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

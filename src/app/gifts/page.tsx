import { Metadata } from 'next';
import GiftCard from '@/components/GiftCard';

export const metadata: Metadata = {
  title: 'بطاقات هدايا VELIX | هدية مميزة لأصدقائك',
  description: 'بطاقة هدايا VELIX - الطريقة المثالية لإهداء أصدقائك ملابس عصرية بجودة عالية. اختر المبلغ اللي يناسبك: 100، 200، 500، 1000 ج.م.',
  keywords: ['بطاقة هدايا', 'gift card', 'VELIX', 'هدية', 'كارت هدايا', 'اشترى هدية'],
  openGraph: {
    title: 'بطاقات هدايا VELIX',
    description: 'بطاقة هدايا VELIX. هدية مميزة تناسب كل المناسبات.',
    url: 'https://velix-eg.store/gifts',
    siteName: 'VELIX',
    locale: 'ar_EG',
    type: 'website',
  },
};

const AMOUNTS = [100, 200, 500, 1000];

export default function GiftsPage() {
  return (
    <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            هدية مميزة
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-black mb-4">بطاقة هدايا VELIX</h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
          <p className="text-black/60 font-bold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            عاوز تهدي صديقك أو شخص عزيز عليك؟ بطاقة هدايا VELIX هي أحسن طريقة إنك تفرحهم 
            بتشكيلتنا المميزة. يختاروا اللي يعجبهم واحنا نوصلهم الطلب.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-14">
          {AMOUNTS.map((amount, idx) => (
            <GiftCard key={amount} amount={amount} index={idx} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-rose-gold/20 p-6 md:p-8 shadow-lg">
          <h2 className="text-xl md:text-2xl font-black text-black text-center mb-6">طريقة الشراء</h2>
          <div className="space-y-4">
            {[
              { num: '١', text: 'اختر المبلغ اللي عاوزه من البطاقات اللي فوق' },
              { num: '٢', text: 'اضغط على "اطلب كهدية" هتفتح واتساب مباشر' },
              { num: '٣', text: 'اكتب البيانات المطلوبة واحنا هنكلمك في أسرع وقت' },
              { num: '٤', text: 'هنبعتلك البطاقة على واتساب أو هتوصل مع أي طلب' },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-black text-sm flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <p className="text-black/70 font-bold text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8 bg-rose-gold/5 rounded-2xl border border-rose-gold/20 p-6 md:p-8">
          <h2 className="text-xl font-black text-black text-center mb-4">معلومات مهمة</h2>
          <ul className="space-y-3">
            {[
              'البطاقة مش ليها تاريخ صلاحية - تقدر تستخدمها في أي وقت',
              'تصلح لجميع منتجات VELIX - تيشرتات، هوديز، شروال، جينز، جواكت، شوزات',
              'تقدر تستخدم بطاقة الهدايا مع أي كود خصم تاني',
              'الدفع عند الاستلام متاح لبطاقات الهدايا كمان',
            ].map((info, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-gold mt-0.5 shrink-0">✓</span>
                <span className="text-black/60 font-bold text-sm">{info}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

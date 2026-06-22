'use client';

import { motion } from 'framer-motion';

interface GiftCardProps {
  amount: number;
  index?: number;
}

const WHATSAPP_NUMBER = '201500125133';

export default function GiftCard({ amount, index = 0 }: GiftCardProps) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `مرحباً VELIX 👋\n\nعاوز أطلب بطاقة هدايا بقيمة ${amount} ج.م\n\nالاسم: \nرقم التليفون: \nالعنوان:`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="bg-linear-to-br from-rose-gold-light via-rose-gold to-copper-dark p-6 md:p-8 aspect-[3/4] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6h-2v2h-2V6h-2V4h2V2h2v2h2v2zm-10 3c0-1.66-1.34-3-3-3S5 7.34 5 9s1.34 3 3 3 3-1.34 3-3zm7 3c-.55 0-1 .45-1 1v.47l-1.76 1.76c-1.06-1.52-2.48-2.73-4.24-3.41-1.06-.41-2.21-.65-3.4-.73-0.13-.06-0.25-.09-.38-.09s-0.25.03-0.38.09c-1.19.08-2.34.32-3.4.73-1.76.68-3.18 1.89-4.24 3.41L4 13.47V12c0-.55-.45-.99-1-.99S2 11.45 2 12v6c0 .55.45 1 1 1h.72l1.7 1.7c.39.39 1.02.39 1.41 0L7 19.41l.88.88c.39.39 1.02.39 1.41 0L10 19.41l.88.88c.39.39 1.02.39 1.41 0L14 19.41l.88.88c.39.39 1.02.39 1.41 0L18 19.41l.88.88c.39.39 1.02.39 1.41 0L21 19.41c.39.39 1.02.39 1.41 0L24 18v-5c0-.55-.45-1-1-1z" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-white/80 text-sm font-bold mb-2">بطاقة هدايا</p>
            <p className="text-white text-4xl md:text-5xl font-black mb-1">{amount}</p>
            <p className="text-white/80 text-sm font-bold">ج.م</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-0.5 bg-white/30 mx-auto mb-2" />
            <p className="text-white/60 text-xs font-bold">VELIX</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button
            onClick={handleWhatsApp}
            className="bg-white text-rose-gold-dark font-bold px-6 py-2.5 rounded-full text-sm hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            اطلب كهدية
          </button>
        </div>
      </div>
    </motion.div>
  );
}

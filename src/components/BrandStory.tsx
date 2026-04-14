'use client';

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-linear-to-t from-white via-[#FCFCFC] to-[#F5F3F0] py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-gold/10 text-rose-gold mb-4">
            {/* 🦅 أيقونة جناح VELIX */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            إحنا مين؟
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            إزاي ابتدت الحكاية؟
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-right"
        >
          <p className="text-black/70 font-bold text-base md:text-lg leading-relaxed">
            كل حاجة بدأت من حلم صغير جوه القاهرة... حلم إننا نعمل حاجة مختلفة، حاجة تخلّي 
            كل شاب مصري يبقى فخور بلبسه، ويحس إنه لابس حاجة مميزة.
          </p>

          <p className="text-black/60 font-bold text-base md:text-lg leading-relaxed">
            VELIX مش مجرد ماركة ملابس، ده مشروع بيحلم إن مصر تكون عندها براند عالمي 
            ينافس أكتر البراندز شهرة في العالم. إحنا عايزين نثبت للعالم إن المصري 
            يقدر يعمل حاجة فخمة، حاجة تستاهل.
          </p>

          <p className="text-black/60 font-bold text-base md:text-lg leading-relaxed">
            كل قطعة بنصنعها بتحمل حلم، وكل تفصيلة فيها قصة. واحنا شايفين إن اللبس 
            مش مجرد قماش، ده تعبير عن شخصيتك وثقتك في نفسك.
          </p>

          <div className="relative mt-8 pt-4">
            <div className="absolute right-0 -top-2 text-6xl text-rose-gold/10 font-serif">"</div>
            <p className="text-rose-gold font-black text-xl md:text-2xl leading-relaxed pr-6">
              VELIX .. فخامة في كل تفصيلة
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 border-2 border-rose-gold/30 text-rose-gold font-bold px-8 py-3 rounded-full hover:bg-rose-gold hover:text-white hover:border-rose-gold transition-all duration-300"
          >
            اعرف أكتر عن VELIX
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
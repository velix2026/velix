'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

const heightOptions = [
  { value: '150-160', label: '150 - 160 سم' },
  { value: '161-170', label: '161 - 170 سم' },
  { value: '171-180', label: '171 - 180 سم' },
  { value: '181-190', label: '181 - 190 سم' },
  { value: '190+', label: '190+ سم' },
];

const weightOptions = [
  { value: '40-60', label: '40 - 60 كجم' },
  { value: '61-75', label: '61 - 75 كجم' },
  { value: '76-90', label: '76 - 90 كجم' },
  { value: '90+', label: '90+ كجم' },
];

const bodyTypeOptions = [
  { value: 'نحيف', label: 'نحيف' },
  { value: 'رياضي', label: 'رياضي' },
  { value: 'متوسط', label: 'متوسط' },
  { value: 'ممتليء', label: 'ممتليء' },
];

const fitOptions = [
  { value: 'ضيق', label: 'ضيق - Slim' },
  { value: 'عادي', label: 'عادي - Regular' },
  { value: 'واسع', label: 'واسع - Oversize' },
];

function calculateSize(height: string, weight: string, bodyType: string, fit: string): string {
  let base = 2;

  if (height === '150-160') base = 0;
  else if (height === '161-170') base = 1;
  else if (height === '171-180') base = 2;
  else if (height === '181-190') base = 3;
  else if (height === '190+') base = 4;

  if (weight === '40-60') base -= 1;
  else if (weight === '61-75') base += 0;
  else if (weight === '76-90') base += 1;
  else if (weight === '90+') base += 2;

  if (bodyType === 'نحيف') base -= 1;
  else if (bodyType === 'رياضي') base += 0;
  else if (bodyType === 'متوسط') base += 0;
  else if (bodyType === 'ممتليء') base += 1;

  if (fit === 'ضيق') base -= 1;
  else if (fit === 'عادي') base += 0;
  else if (fit === 'واسع') base += 1;

  base = Math.max(0, Math.min(6, base));
  return SIZES[base];
}

const sizeDetails: Record<string, { chest: string; length: string; weight: string }> = {
  XS: { chest: '84-88', length: '64-66', weight: '45-55' },
  S: { chest: '88-92', length: '66-68', weight: '55-65' },
  M: { chest: '92-96', length: '68-70', weight: '65-75' },
  L: { chest: '96-100', length: '70-72', weight: '75-85' },
  XL: { chest: '100-104', length: '72-74', weight: '85-95' },
  '2XL': { chest: '104-108', length: '74-76', weight: '95-110' },
  '3XL': { chest: '108-112', length: '76-78', weight: '110-125' },
};

export default function SizeQuiz({ isOpen, onClose }: SizeQuizProps) {
  const [step, setStep] = useState(0);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [fit, setFit] = useState('');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const questions = [
    {
      title: 'ما هو طولك؟',
      value: height,
      setter: setHeight,
      options: heightOptions,
    },
    {
      title: 'ما هو وزنك؟',
      value: weight,
      setter: setWeight,
      options: weightOptions,
    },
    {
      title: 'ما هو شكل جسمك؟',
      value: bodyType,
      setter: setBodyType,
      options: bodyTypeOptions,
    },
    {
      title: 'إزاي بتحب لبسك يكون؟',
      value: fit,
      setter: setFit,
      options: fitOptions,
    },
  ];

  const current = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const calculated = calculateSize(height, weight, bodyType, fit);
      setResult(calculated);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      setStep(questions.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = current?.value !== '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {!result ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden">
                <div className="relative bg-linear-to-r from-rose-gold-light via-rose-gold to-copper p-4 text-center">
                  <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="text-lg font-black text-white">اعرف مقاسك</h3>
                  </div>
                  <div className="flex justify-center gap-1 mt-3">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-white' : i < step ? 'w-3 bg-white/60' : 'w-3 bg-white/20'}`} />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-black text-black mb-4 text-center">{current.title}</h4>
                    <div className="space-y-2">
                      {current.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => current.setter(opt.value)}
                          className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                            current.value === opt.value
                              ? 'bg-rose-gold/10 border-rose-gold text-rose-gold'
                              : 'bg-white border-rose-gold/10 text-black hover:border-rose-gold/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleBack}
                      disabled={step === 0}
                      className="flex-1 py-2.5 rounded-xl border-2 border-rose-gold/20 text-rose-gold font-bold hover:bg-rose-gold/5 transition disabled:opacity-30"
                    >
                      رجوع
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-md"
                    >
                      {step < questions.length - 1 ? 'التالي' : 'عرفني مقاسي'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden">
                <div className="relative bg-linear-to-r from-rose-gold-light via-rose-gold to-copper p-6 text-center">
                  <button onClick={onClose} className="absolute left-4 top-4 text-white/80 hover:text-white transition p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', damping: 12 }}
                    className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-white/80 font-bold">مقاسك المناسب</h3>
                </div>

                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 10 }}
                    className="text-6xl font-black text-rose-gold mb-2"
                  >
                    {result}
                  </motion.div>
                  <p className="text-black/50 font-bold mb-4">ده المقاس اللي يناسبك حسب اختياراتك</p>

                  {sizeDetails[result] && (
                    <div className="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/10 mb-4">
                      <p className="text-sm font-bold text-black mb-2">القياسات التقريبية:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-black/50">الصدر</p>
                          <p className="font-bold text-black">{sizeDetails[result].chest} سم</p>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-black/50">الطول</p>
                          <p className="font-bold text-black">{sizeDetails[result].length} سم</p>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-black/50">الوزن</p>
                          <p className="font-bold text-black">{sizeDetails[result].weight} كجم</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-2.5 rounded-xl border-2 border-rose-gold/20 text-rose-gold font-bold hover:bg-rose-gold/5 transition"
                    >
                      إعادة
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold hover:scale-[1.02] transition-all shadow-md"
                    >
                      تم
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

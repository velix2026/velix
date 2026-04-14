import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0]">
      <div className="text-center px-4">
        {/* رقم 404 نحاسي */}
        <div className="text-8xl md:text-9xl font-black text-rose-gold/20 mb-4">
          404
        </div>
        
        {/* أيقونة */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-rose-gold/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-black mb-4">
          الصفحة مش موجودة
        </h1>
        
        <p className="text-black/60 font-bold mb-8 max-w-md mx-auto">
          عذراً، الصفحة اللي بتدور عليها مش متاحة أو اتمسحت.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-full hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
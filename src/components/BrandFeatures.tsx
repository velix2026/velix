export default function BrandFeatures() {
  return (
    <section className="bg-white py-20 md:py-28 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs text-gray-400 tracking-[0.2em] uppercase mb-3 block">
            لماذا تختار VELIX
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            جودة تستحق الثقة
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            نضع الجودة والتفاصيل في مقدمة أولوياتنا لنقدم لك تجربة استثنائية
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
          {/* جودة في التفاصيل */}
          <div className="group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl md:rounded-2xl group-hover:bg-gray-100 transition-all duration-300">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">👕</span>
            </div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">جودة في التفاصيل</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
              كل قطعة بتصنع بدقة عالية، ونختار أفضل الخامات عشان تدوم معاك لأطول فترة.
            </p>
          </div>

          {/* صناعة مصرية */}
          <div className="group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl md:rounded-2xl group-hover:bg-gray-100 transition-all duration-300">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇪🇬</span>
            </div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">صناعة مصرية</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
              براند مصري 100% بيفتخر بجذوره، ويدعم الصناعة المحلية بكل فخر.
            </p>
          </div>

          {/* دفع عند الاستلام */}
          <div className="group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl md:rounded-2xl group-hover:bg-gray-100 transition-all duration-300">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">📦</span>
            </div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">دفع عند الاستلام</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
              اطلب دلوقتي واستلم منتجك وادفع بعد ما تتأكد من جودة المنتج.
            </p>
          </div>

          {/* خدمة عملاء */}
          <div className="group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-gray-50 rounded-xl md:rounded-2xl group-hover:bg-gray-100 transition-all duration-300">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">💬</span>
            </div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">دعم فوري</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
              فريقنا متاح للرد على استفساراتك عبر واتساب، لضمان تجربة شراء سلسة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
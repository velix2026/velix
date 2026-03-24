export default function BrandFeatures() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">جودة في التفاصيل</h3>
            <p className="text-gray-500 text-sm">كل قطعة بتصنع بدقة عالية عشان تدوم معاك</p>
          </div>
          <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🇪🇬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">صناعة مصرية</h3>
            <p className="text-gray-500 text-sm">براند مصري 100% بيفتخر بجذوره</p>
          </div>
          <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">دفع عند الاستلام</h3>
            <p className="text-gray-500 text-sm">اطلب دلوقتي واستلم منتجك وادفع بعد ما ترتاح</p>
          </div>
        </div>
      </div>
    </section>
  );
}
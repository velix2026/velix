export const metadata = {
  title: "سياسة الاستبدال والاسترجاع | VELIX",
  description: "تعرف على سياسة الاستبدال والاسترجاع في VELIX. نضمن رضاك عن منتجاتنا.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">سياسة الاستبدال والاسترجاع</h1>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-8" />
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">1. فترة الاستبدال والاسترجاع</h2>
            <p className="text-gray-600">يمكنك استبدال أو استرجاع المنتج خلال 14 يوم من تاريخ الاستلام.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">2. شروط الاستبدال والاسترجاع</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>أن يكون المنتج غير مستخدم ولم يتم غسله</li>
              <li>أن يكون المنتج بحالته الأصلية مع البطاقات</li>
              <li>إرفاق فاتورة الشراء</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">3. رسوم الاستبدال</h2>
            <p className="text-gray-600">الاستبدال مجاني تماماً، لا توجد أي رسوم إضافية.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">4. كيفية الاستبدال</h2>
            <p className="text-gray-600">تواصل معنا عبر واتساب لتنسيق عملية الاستبدال.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
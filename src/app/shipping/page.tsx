export const metadata = {
  title: "سياسة الشحن | VELIX",
  description: "تعرف على سياسة الشحن والتوصيل في VELIX. نوصل طلباتك لجميع المحافظات.",
};

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">سياسة الشحن</h1>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-8" />
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">1. مناطق التوصيل</h2>
            <p className="text-gray-600">نقوم بتوصيل الطلبات لجميع محافظات جمهورية مصر العربية.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">2. رسوم الشحن</h2>
            <p className="text-gray-600">رسوم الشحن 25 جنيه للطلبات التي تقل قيمتها عن 1000 جنيه.</p>
            <p className="text-gray-600 mt-2">الطلبات التي تزيد قيمتها عن 1000 جنيه تحصل على شحن مجاني.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">3. مدة التوصيل</h2>
            <p className="text-gray-600">يتم تجهيز الطلب خلال 1-3 أيام عمل.</p>
            <p className="text-gray-600 mt-2">مدة التوصيل من 2-5 أيام عمل حسب المنطقة.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">4. متابعة الطلب</h2>
            <p className="text-gray-600">سيتم إرسال رقم تتبع الطلب عبر واتساب بعد شحنه.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
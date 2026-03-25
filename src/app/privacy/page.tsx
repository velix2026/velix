export const metadata = {
  title: "سياسة الخصوصية | VELIX",
  description: "تعرف على سياسة الخصوصية في VELIX وكيف نحمي بياناتك.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">سياسة الخصوصية</h1>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-8" />
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">1. المعلومات التي نجمعها</h2>
            <p className="text-gray-600">نقوم بجمع المعلومات التي تقدمها عند طلب المنتج: الاسم، رقم الهاتف، العنوان.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">2. استخدام المعلومات</h2>
            <p className="text-gray-600">نستخدم معلوماتك لتجهيز طلباتك والتواصل معك بشأنها.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">3. حماية المعلومات</h2>
            <p className="text-gray-600">نلتزم بحماية بياناتك وعدم مشاركتها مع أي طرف ثالث.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">4. التعديلات على السياسة</h2>
            <p className="text-gray-600">نحتفظ بالحق في تعديل سياسة الخصوصية في أي وقت.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
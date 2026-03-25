import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "عن VELIX | براند ملابس مصري",
  description: "تعرف على قصة VELIX، رؤيتنا، رسالتنا، وقيمنا. براند ملابس مصري يجمع بين الجودة والتصميم العصري.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">عن VELIX</h1>
          <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            قصة براند مصري يهدف لإعادة تعريف الأسلوب العصري بجودة استثنائية.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">قصتنا</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              انطلق VELIX من فكرة بسيطة: تقديم ملابس تجمع بين الجودة العالية والتصميم العصري الذي يناسب الشباب المصري. 
              كل قطعة نصنعها تحمل بصمة خاصة، تعكس شخصية من يرتديها.
            </p>
            <p className="text-gray-600 leading-relaxed">
              نؤمن بأن التفاصيل هي ما تصنع الفرق. لذلك نختار أفضل الخامات، ونولي اهتماماً خاصاً لكل تفصيلة، 
              لنقدم لك منتجاً يليق بذوقك في أي وقت وأي مكان.
            </p>
          </div>
          <div className="relative h-100 rounded-2xl overflow-hidden">
            <Image
              src="/images/about-hero.jpg"
              alt="VELIX قصة البراند"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-bold mb-3">رؤيتنا</h3>
            <p className="text-gray-600">
              أن نكون الوجهة الأولى للشباب المصري الباحث عن أسلوب عصري وجودة استثنائية،
              ونمثل الهوية المصرية في عالم الأزياء.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">رسالتنا</h3>
            <p className="text-gray-600">
              تقديم ملابس تجمع بين الأناقة والراحة، مع الالتزام بأعلى معايير الجودة،
              ودعم الصناعة المصرية.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">قيمنا</h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-bold mb-2">الجودة أولاً</h3>
              <p className="text-gray-500 text-sm">نختار أفضل الخامات لضمان منتج يدوم طويلاً</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-bold mb-2">تصميم عصري</h3>
              <p className="text-gray-500 text-sm">نواكب أحدث صيحات الموضة بأناقة مصرية</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold mb-2">ثقة العميل</h3>
              <p className="text-gray-500 text-sm">رضاك هو هدفنا الأول، نضمن جودة منتجاتنا</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-900 text-white py-12 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">انضم لعائلة VELIX</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            اكتشف مجموعتنا وكن جزءاً من تجربة أزياء مختلفة.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
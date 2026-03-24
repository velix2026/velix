import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center md:text-right order-2 md:order-1">
            <span className="text-xs text-gray-400 tracking-[0.2em] uppercase">
              مجموعة الربيع 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-4 mb-4 tracking-tight">
              VELIX
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف.
              <br />
              جودة في كل تفصيلة، ودفع عند الاستلام.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="/products"
                className="bg-black text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                تسوق الآن
              </Link>
              <Link
                href="/about"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-300"
              >
                اكتشف القصة
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
            <Image
              src="/images/hero-model.jpg"
              alt="VELIX - أحدث مجموعة ربيع 2026"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
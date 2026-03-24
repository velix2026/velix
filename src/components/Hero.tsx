import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-white pt-24 md:pt-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content - Centered Vertically */}
          <div className="text-center md:text-right order-2 md:order-1">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 tracking-tighter leading-[1.1]">
              VELIX
            </h1>
            <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-bold">
              براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف.
              <br />
              جودة في كل تفصيلة، ودفع عند الاستلام.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                href="/products"
                className="group bg-black text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3 w-full md:w-auto"
                style={{ minWidth: "220px" }}
              >
                <svg 
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                </svg>
                تسوق الآن
              </Link>
            </div>
          </div>

          {/* Image Layout: Large Model Image + 3 Small Images Below */}
          <div className="order-1 md:order-2 space-y-3">
            {/* Large Model Image */}
            <div className="relative h-75 md:h-112.5 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero-model.png"
                alt="VELIX موديل - مجموعة الربيع 2026"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* 3 Small Images Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src="/images/hoodie-flat.png"
                  alt="VELIX هودي أوفر سايز"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src="/images/pants-flat.png"
                  alt="VELIX شروال رياضي"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src="/images/tshirt-flat.png"
                  alt="VELIX تيشرت كلاسيك"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
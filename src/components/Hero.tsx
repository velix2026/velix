import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              VELIX
              <span className="block text-xl md:text-2xl font-normal mt-2">
                ستايلك. تفاصيلك. هويتك.
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              براند ملابس مصري بيقدملك ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف. 
              جودة في كل تفصيلة، ودفع عند الاستلام.
            </p>
            <div className="flex gap-4">
              <a
                href="/products"
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                تسوق الآن
              </a>
              <a
                href="https://wa.me/201000000000?text=أنا%20عايز%20أعرف%20أكتر%20عن%20VELIX"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition"
              >
                تواصل معنا
              </a>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/images/hero-image.jpg"
              alt="VELIX ملابس مصرية عصرية"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
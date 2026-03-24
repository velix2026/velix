export default function Header() {
  return (
    <header className="bg-black text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold tracking-wide">VELIX</a>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:text-gray-300 transition">الرئيسية</a></li>
            <li><a href="/products" className="hover:text-gray-300 transition">المنتجات</a></li>
            <li><a href="https://wa.me/201000000000" target="_blank" className="hover:text-gray-300 transition">تواصل</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
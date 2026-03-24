export default function Header() {
  return (
    <header className="bg-black text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">VELIX</h1>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:text-gray-300">الرئيسية</a></li>
            <li><a href="/products" className="hover:text-gray-300">المنتجات</a></li>
            <li><a href="/contact" className="hover:text-gray-300">تواصل</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
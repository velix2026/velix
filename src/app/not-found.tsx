import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}
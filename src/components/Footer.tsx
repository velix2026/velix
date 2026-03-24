export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 mt-16">
      <div className="container mx-auto text-center">
        <p className="mb-2">VELIX © {new Date().getFullYear()}</p>
        <p className="text-sm text-gray-400">جودة في كل تفصيلة</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="https://instagram.com/velix" target="_blank" className="text-gray-400 hover:text-white">Instagram</a>
          <a href="https://facebook.com/velix" target="_blank" className="text-gray-400 hover:text-white">Facebook</a>
          <a href="https://tiktok.com/@velix" target="_blank" className="text-gray-400 hover:text-white">TikTok</a>
        </div>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 mt-16">
      <div className="container mx-auto text-center">
        <p className="mb-2">VELIX © {new Date().getFullYear()}</p>
        <p className="text-sm text-gray-400">جودة في كل تفصيلة</p>
      </div>
    </footer>
  );
}
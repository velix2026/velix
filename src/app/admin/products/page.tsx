'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/products';

// المقاسات المتاحة
const allSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// الألوان المتاحة
const allColors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
  { name: 'كحلي', value: '#0F172A', code: 'navy' },
  { name: 'بني', value: '#8B4513', code: 'brown' },
  { name: 'ذهبي', value: '#FFD700', code: 'gold' },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadProducts = async () => {
    const allProducts = await getProducts();
    setProducts(allProducts);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('✅ تم حذف المنتج بنجاح');
      } else {
        alert('❌ حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('❌ حدث خطأ في الاتصال');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      
      if (res.ok) {
        await loadProducts();
        setEditingProduct(null);
        alert('✅ تم تحديث المنتج بنجاح');
      } else {
        alert('❌ حدث خطأ أثناء التحديث');
      }
    } catch {
      alert('❌ حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (size: string) => {
    if (!editingProduct) return;
    const currentSizes = editingProduct.sizes || [];
    if (currentSizes.includes(size)) {
      setEditingProduct({ ...editingProduct, sizes: currentSizes.filter(s => s !== size) });
    } else {
      setEditingProduct({ ...editingProduct, sizes: [...currentSizes, size] });
    }
  };

  const toggleColor = (colorCode: string) => {
    if (!editingProduct) return;
    const currentColors = editingProduct.colors || [];
    if (currentColors.includes(colorCode)) {
      setEditingProduct({ ...editingProduct, colors: currentColors.filter(c => c !== colorCode) });
    } else {
      setEditingProduct({ ...editingProduct, colors: [...currentColors, colorCode] });
    }
  };

  // دالة مساعدة للوصول الآمن إلى product.stock
  const getProductStock = (product: Product): number => {
    return product.stock !== undefined ? product.stock : 0;
  };

  // دالة مساعدة للوصول الآمن إلى product.sizes
  const getProductSizes = (product: Product): string[] => {
    return product.sizes || [];
  };

  // دالة مساعدة للوصول الآمن إلى product.colors
  const getProductColors = (product: Product): string[] => {
    return product.colors || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            <p className="text-gray-500 mt-1">تعديل وحذف المنتجات</p>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2 bg-stone-800 text-white rounded-full text-sm font-medium hover:bg-stone-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة منتج جديد
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const stock = getProductStock(product);
            const sizes = getProductSizes(product);
            const colors = getProductColors(product);
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">نفذت الكمية</span>
                    </div>
                  )}
                  {stock < 5 && stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      باقي {stock} فقط
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-gray-500 text-sm">{product.category}</p>
                    </div>
                    {product.isNew && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">جديد</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-black">{product.price} جنيه</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.oldPrice} جنيه</span>
                    )}
                    {product.discount && product.discount > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">-{product.discount}%</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {sizes.map((size) => (
                      <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">{size}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {colors.map((colorCode) => {
                      const color = allColors.find(c => c.code === colorCode);
                      return (
                        <div
                          key={colorCode}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color?.value || colorCode }}
                          title={color?.name}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {deletingId === product.id ? (
                        'جاري الحذف...'
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          حذف
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">تعديل المنتج</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">السعر (جنيه)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">السعر القديم (اختياري)</label>
                    <input
                      type="number"
                      value={editingProduct.oldPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">المخزون</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">القسم</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="تيشرتات">تيشرتات</option>
                      <option value="هوديز">هوديز</option>
                      <option value="شروال">شروال</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={editingProduct.isNew || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isNew" className="text-sm font-medium">منتج جديد</label>
                </div>
                
                {/* المقاسات */}
                <div>
                  <label className="block text-sm font-medium mb-2">المقاسات المتاحة</label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          editingProduct.sizes?.includes(size)
                            ? 'bg-stone-800 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">اختر المقاسات المتاحة للمنتج</p>
                </div>
                
                {/* الألوان */}
                <div>
                  <label className="block text-sm font-medium mb-2">الألوان المتاحة</label>
                  <div className="flex flex-wrap gap-3">
                    {allColors.map((color) => (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => toggleColor(color.code)}
                        className={`w-10 h-10 rounded-full transition-all duration-200 ${
                          editingProduct.colors?.includes(color.code)
                            ? 'ring-2 ring-offset-2 ring-stone-800 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          border: color.border ? '1px solid #e5e7eb' : 'none',
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">اختر الألوان المتاحة للمنتج</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
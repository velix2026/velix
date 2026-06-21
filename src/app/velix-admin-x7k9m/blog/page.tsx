'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  read_time: string;
  is_published: boolean;
  published_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Form state
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('نصائح');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState('5 دقايق');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/blog`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }

  function openNew() {
    setEditingPost(null);
    setSlug(''); setTitle(''); setExcerpt(''); setContent('');
    setCategory('نصائح'); setTags(''); setReadTime('5 دقايق'); setIsPublished(true);
    setShowEditor(true);
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post);
    setSlug(post.slug); setTitle(post.title); setExcerpt(post.excerpt || '');
    setContent(''); setCategory(post.category || 'نصائح');
    setTags(post.tags?.join(', ') || ''); setReadTime(post.read_time || '5 دقايق');
    setIsPublished(post.is_published);
    setShowEditor(true);
  }

  async function handleSave() {
    if (!slug || !title) return;
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const body = { slug, title, excerpt, content, category, tags: tagArray, readTime, isPublished };

    try {
      const res = editingPost
        ? await fetch(`/api/${ADMIN_SECRET_PATH}/blog`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, id: editingPost.id }) })
        : await fetch(`/api/${ADMIN_SECRET_PATH}/blog`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        setShowEditor(false);
        fetchPosts();
      }
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm('متأكد من حذف المقال؟')) return;
    try {
      await fetch(`/api/${ADMIN_SECRET_PATH}/blog?id=${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/${ADMIN_SECRET_PATH}`} className="text-sm text-rose-gold hover:underline mb-2 block">الرجوع للوحة التحكم</Link>
            <h1 className="text-3xl font-black text-black">إدارة المقالات</h1>
          </div>
          <button onClick={openNew} className="px-6 py-3 bg-rose-gold text-white font-bold rounded-xl hover:scale-[1.02] transition">+ مقال جديد</button>
        </div>

        {showEditor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-rose-gold/20 mb-8">
            <h2 className="text-xl font-black text-black mb-4">{editingPost ? 'تعديل مقال' : 'مقال جديد'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">Slug (رابط)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">وقت القراءة</label>
                <input value={readTime} onChange={e => setReadTime(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black/60 mb-1">العنوان</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black/60 mb-1">الوصف المختصر</label>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black/60 mb-1">المحتوى (HTML)</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
                  className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black font-mono text-sm" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">القسم</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black">
                  <option>نصائح</option><option>دليل مقاسات</option><option>عناية</option><option>خامات</option><option>ستايل</option><option>هدايا</option><option>تسوق</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">Tags (مفصولة بفاصلة)</label>
                <input value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" placeholder="tag1, tag2, tag3" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-5 h-5 accent-rose-gold" />
                  <span className="font-bold text-black/60">منشور</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-3 bg-rose-gold text-white font-bold rounded-xl hover:scale-[1.02] transition">حفظ</button>
              <button onClick={() => setShowEditor(false)} className="px-6 py-3 bg-black/10 text-black font-bold rounded-xl hover:bg-black/20 transition">إلغاء</button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-16"><div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-5 border border-rose-gold/20 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold font-bold">{post.category}</span>
                    {!post.is_published && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">مسودة</span>}
                  </div>
                  <h3 className="font-black text-black">{post.title}</h3>
                  <p className="text-sm text-black/40">{post.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(post)} className="px-4 py-2 bg-rose-gold/10 text-rose-gold font-bold rounded-xl hover:bg-rose-gold/20 transition text-sm">تعديل</button>
                  <button onClick={() => handleDelete(post.id)} className="px-4 py-2 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition text-sm">حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

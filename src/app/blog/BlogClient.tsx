// app/blog/BlogClient.tsx
'use client';

import Link from 'next/link'
import { useState, useMemo } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import { posts } from './posts-data'

const allCategories = ["الكل", ...new Set(posts.map(post => post.category))]

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  const filteredPosts = useMemo(() => {
    let filtered = posts
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return filtered
  }, [selectedCategory, searchQuery])

  const featuredPost = filteredPosts[0]
  const restPosts = filteredPosts.slice(1)

  const getCategoryCount = (category: string) => {
    if (category === "الكل") return posts.length
    return posts.filter(p => p.category === category).length
  }

  // Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مدونة VELIX - دليل الموضة المصري",
    "description": "نصائح وإرشادات عن الموضة والملابس في مصر.",
    "url": "https://velix-eg.store/blog",
    "inLanguage": "ar-EG",
    "numberOfPosts": posts.length,
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VELIX",
    "url": "https://velix-eg.store",
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VELIX",
    "url": "https://velix-eg.store",
    "logo": "https://velix-eg.store/images/logo.png",
    "sameAs": [
      "https://instagram.com/velixstore.eg",
      "https://facebook.com/velixstore.eg",
      "https://tiktok.com/@velixstore.eg",
      "https://wa.me/201500125133"
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-gold/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-rose-gold text-sm">📖</span>
              <span className="text-rose-gold text-xs font-bold tracking-wider">مدونتنا</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4">
              دليل الموضة <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper bg-clip-text text-transparent">المصري</span>
            </h1>
            <div className="w-24 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              نصائح، إرشادات، ودليل كامل عشان تبقى دايماً شيك ومطلع على أحدث صيحات الموضة في مصر
            </p>
            
            {/* Stats Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-rose-gold/20">
                <span className="text-rose-gold font-black">{filteredPosts.length}</span>
                <span className="text-black/50 text-sm mr-1">مقالة</span>
              </div>
              <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-rose-gold/20">
                <span className="text-rose-gold font-black">{posts.length}</span>
                <span className="text-black/50 text-sm mr-1">إجمالي المقالات</span>
              </div>
              <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-rose-gold/20">
                <span className="text-rose-gold font-black">+25,000</span>
                <span className="text-black/50 text-sm mr-1">كلمة</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 ابحث عن مقال... (مثال: مقاسات، قطن، غسيل)"
                className="w-full p-3 pr-4 bg-white border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-rose-gold transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {allCategories.map((category) => {
              const isActive = selectedCategory === category
              const count = getCategoryCount(category)
              const categoryData = posts.find(p => p.category === category)
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-rose-gold text-white shadow-md"
                      : categoryData 
                        ? `${categoryData.categoryColor} shadow-sm`
                        : "bg-gray-100 text-gray-700 shadow-sm"
                  }`}
                >
                  {category === "الكل" ? "🎯 الكل" : `${categoryData?.categoryIcon || "📌"} ${category}`}
                  <span className={`mr-1 text-xs ${isActive ? "text-white/80" : "opacity-60"}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-black/60 text-sm">
                🎯 نتائج البحث عن "<span className="text-rose-gold font-bold">{searchQuery}</span>": 
                <span className="font-bold text-rose-gold"> {filteredPosts.length} </span> 
                مقالة
              </p>
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-rose-gold/20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-black mb-2">مفيش نتائج</h3>
              <p className="text-black/60 mb-4">
                {searchQuery 
                  ? `مفيش مقالات تطابق "${searchQuery}"`
                  : `مفيش مقالات في قسم ${selectedCategory} حالياً`
                }
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("الكل")
                  setSearchQuery("")
                }}
                className="px-6 py-2 bg-rose-gold text-white font-bold rounded-full hover:scale-105 transition"
              >
                عرض كل المقالات
              </button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {!searchQuery && (
                <div className="mb-16">
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-rose-gold/20 hover:shadow-2xl transition-all duration-500 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 rounded-full blur-2xl z-0" />
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className={`relative h-64 md:h-full bg-linear-to-br ${featuredPost.imageBg} flex items-center justify-center overflow-hidden`}>
                        <div className="text-8xl md:text-9xl group-hover:scale-110 transition-transform duration-500">{featuredPost.categoryIcon}</div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-rose-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ مقال مميز</span>
                        </div>
                      </div>
                      <div className="p-8 md:p-10">
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${featuredPost.categoryColor}`}>
                            {featuredPost.categoryIcon} {featuredPost.category}
                          </span>
                          <span className="text-xs text-black/40 flex items-center gap-1">📅 {featuredPost.date}</span>
                          <span className="text-xs text-black/40 flex items-center gap-1">⏱️ {featuredPost.readTime}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-4 leading-tight">
                          <Link href={`/blog/${featuredPost.slug}`} className="hover:text-rose-gold transition duration-300">
                            {featuredPost.title}
                          </Link>
                        </h2>
                        <p className="text-black/60 font-bold mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                        <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/30 group">
                          اقرأ المقال
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Title */}
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-black">
                  {searchQuery ? "🔍 نتائج البحث" : "📚 أحدث المقالات"}
                </h2>
                <div className="w-16 h-0.5 bg-rose-gold/30 mx-auto mt-3" />
              </div>

              {/* Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery ? filteredPosts : restPosts).map((post) => (
                  <article key={post.slug} className="group bg-white rounded-2xl overflow-hidden shadow-md border border-rose-gold/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className={`relative h-48 bg-linear-to-br ${post.imageBg} flex items-center justify-center overflow-hidden`}>
                        <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{post.categoryIcon}</div>
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-[10px] font-bold">⏱️ {post.readTime}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>
                            {post.categoryIcon} {post.category}
                          </span>
                          <span className="text-xs text-black/40 flex items-center gap-1">📅 {post.date}</span>
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-black mb-2 line-clamp-2 group-hover:text-rose-gold transition duration-300">
                          {post.title}
                        </h2>
                        <p className="text-black/50 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-rose-gold/10">
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-rose-gold/10 flex items-center justify-center">
                              <span className="text-rose-gold text-[10px]">📖</span>
                            </div>
                            <span className="text-xs text-black/40">VELIX</span>
                          </div>
                          <span className="text-rose-gold font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            اقرأ
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* Categories Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 border border-rose-gold/20">
            <h3 className="text-xl font-black text-black text-center mb-6">📂 استكشف بالأقسام</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {allCategories.filter(c => c !== "الكل").map((category) => {
                const post = posts.find(p => p.category === category)
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 ${post?.categoryColor} shadow-sm`}
                  >
                    {post?.categoryIcon} {category} ({getCategoryCount(category)})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 text-center bg-linear-to-r from-rose-gold/5 to-copper/5 rounded-3xl p-10 border border-rose-gold/20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-gold/10 text-rose-gold mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-black mb-2">عايز يوصللك كل جديد؟</h3>
            <p className="text-black/60 font-bold mb-6 max-w-md mx-auto">اشترك في النشرة البريدية وهنوصلك كل مقالات جديدة أول بأول</p>
            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-3 rounded-full hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/30 cursor-pointer"
            >
              📧 اشترك دلوقتي
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-black/30 text-xs">كل المحتوى حصري لـ VELIX | آخر تحديث: أبريل 2026</p>
          </div>
        </div>
      </div>

      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </>
  )
}
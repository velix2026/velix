// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { posts } from '../posts-data'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  
  if (!post) {
    return { title: "المقال غير موجود | VELIX" }
  }
  
  return {
    title: `${post.title} | VELIX مدونة`,
    description: post.excerpt,
    keywords: [...post.tags, post.category],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://velix-eg.store/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  
  if (!post) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
  }

  const relatedPosts = posts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link href="/" className="text-black/40 hover:text-rose-gold">الرئيسية</Link>
            <span className="text-black/30">/</span>
            <Link href="/blog" className="text-black/40 hover:text-rose-gold">المدونة</Link>
            <span className="text-black/30">/</span>
            <span className="text-black/40">{post.category}</span>
            <span className="text-black/30">/</span>
            <span className="text-rose-gold font-bold line-clamp-1">{post.title}</span>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-3 py-1 rounded-full">
                📖 {post.category}
              </span>
              <span className="text-xs text-black/40">📅 {post.date}</span>
              <span className="text-xs text-black/40">⏱️ {post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">{post.title}</h1>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto" />
          </div>

          <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-black/70 prose-p:font-bold prose-p:leading-relaxed prose-li:text-black/70 prose-li:font-bold prose-strong:text-rose-gold" 
            dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-8 pt-6 border-t border-rose-gold/20">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs bg-rose-gold/10 text-rose-gold px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-rose-gold/20">
              <h3 className="text-xl font-black text-black mb-6 text-center">📚 مقالات تانية ممكن تعجبك</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map(related => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="block bg-white rounded-xl p-4 border border-rose-gold/20 hover:shadow-md transition group">
                    <h4 className="font-black text-black text-sm line-clamp-2 group-hover:text-rose-gold transition">{related.title}</h4>
                    <p className="text-black/40 text-xs">{related.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
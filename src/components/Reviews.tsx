'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumber } from '@/lib/utils';

interface Review {
  id: number;
  product_id: number;
  product_slug: string;
  customer_name: string;
  customer_phone: string;
  rating: number;
  review_text: string;
  image_url: string;
  is_approved: boolean;
  created_at: string;
}

interface ReviewsProps {
  productSlug: string;
  productId: number;
}

export default function Reviews({ productSlug, productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}&approved=true`),
        fetch(`/api/reviews/${encodeURIComponent(productSlug)}`),
      ]);
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data);
      }
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setAverageRating(stats.averageRating);
        setReviewCount(stats.reviewCount);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || rating === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug,
          productId,
          customerName,
          customerPhone,
          rating,
          reviewText,
          imageUrl: imageUrl || undefined,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setCustomerName('');
        setCustomerPhone('');
        setRating(0);
        setReviewText('');
        setImageUrl('');
        fetchReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${star <= (hoverRating || rating || value) ? 'text-rose-gold' : 'text-rose-gold/20'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="mt-10 pt-8 border-t border-rose-gold/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-rose-gold/10 rounded w-48" />
          <div className="h-4 bg-rose-gold/10 rounded w-64" />
          <div className="h-20 bg-rose-gold/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-10 pt-8 border-t border-rose-gold/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-black flex items-center gap-2">
          <svg className="w-6 h-6 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          التقييمات
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-bold text-rose-gold hover:text-copper transition-colors border border-rose-gold/30 px-4 py-1.5 rounded-full hover:bg-rose-gold/5"
        >
          {showForm ? '✕ إلغاء' : '+ ضيف تقييم'}
        </button>
      </div>

      {reviewCount > 0 && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-rose-gold/5 rounded-xl border border-rose-gold/10">
          <div className="text-center">
            <div className="text-3xl font-black text-rose-gold">{toArabicNumber(averageRating.toFixed(1))}</div>
            <div className="text-xs text-black/50 font-bold">من ٥</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-xs text-black/50 font-bold mt-1">{toArabicNumber(reviewCount)} تقييم</div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-rose-gold/5 rounded-2xl p-4 md:p-6 border border-rose-gold/10 space-y-4">
              <h3 className="text-lg font-black text-black">كتابة تقييم</h3>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">تقييمك</label>
                {renderStars(0, true)}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">الاسم <span className="text-rose-gold">*</span></label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-gold/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm"
                  placeholder="اكتب اسمك"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">رقم الموبايل (اختياري)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-gold/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm"
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">التعليق</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-gold/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm resize-none"
                  placeholder="اكتب رأيك في المنتج"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1.5">لينك الصورة (اختياري)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-gold/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm"
                  placeholder="https://example.com/photo.jpg"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !customerName || rating === 0}
                className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-2.5 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-bold text-center"
        >
          تم إرسال تقييمك! سيظهر بعد المراجعة
        </motion.div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-black/40 font-bold">
          <div className="text-4xl mb-2">💬</div>
          <p>لا توجد تقييمات بعد. كن أول من يقيم!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 border border-rose-gold/10 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper flex items-center justify-center text-white font-bold text-sm">
                      {review.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-black">{review.customer_name}</p>
                      <p className="text-[10px] text-black/40">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? 'text-rose-gold' : 'text-rose-gold/20'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {review.review_text && (
                <p className="text-sm text-black/70 leading-relaxed mt-2">{review.review_text}</p>
              )}

              {review.image_url && (
                <div className="mt-3">
                  <img
                    src={review.image_url}
                    alt="صورة التقييم"
                    className="w-20 h-20 object-cover rounded-xl border border-rose-gold/10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

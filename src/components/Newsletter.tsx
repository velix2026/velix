'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('success');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const savedEmail = localStorage.getItem('velix_newsletter_email');
    if (savedEmail) {
      setIsSubscribed(true);
      setSubscribedEmail(savedEmail);
      setNewEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessageType('error');
      setMessage('❌ البريد الإلكتروني مش صحيح، حاول تاني');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setNewEmail(email);
        setMessageType('success');
        setMessage(data.reactivated ? '✅ مرحبا بعودتك! تم تفعيل اشتراكك تاني' : '✅ اشتركت معانا! هتوصلک العروض أول بأول');
        setEmail('');
        setTimeout(() => setMessage(''), 4000);
      } else if (data.alreadySubscribed) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setNewEmail(email);
        setMessageType('info');
        setMessage('ℹ️ انت مشترك معانا بالفعل، شكراً لدعمك');
        setEmail('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ حصل مشكلة، حاول تاني');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ مشكلة في الاتصال، تأكد من النت بتاعك');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setMessageType('error');
      setMessage('❌ البريد الإلكتروني مش صحيح');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail: subscribedEmail, newEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('velix_newsletter_email', newEmail);
        setSubscribedEmail(newEmail);
        setIsEditing(false);
        setMessageType('success');
        setMessage('✅ تم تعديل بريدك بنجاح');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ فشل التعديل، حاول تاني');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ حصل مشكلة، حاول تاني');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('velix_newsletter_email');
        setIsSubscribed(false);
        setSubscribedEmail('');
        setNewEmail('');
        setShowUnsubscribeConfirm(false);
        setMessageType('success');
        setMessage('✅ تم إلغاء الاشتراك. نقدرك وانتظرك في أي وقت');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ فشل إلغاء الاشتراك');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ حصل مشكلة، حاول تاني');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-red-500';
      case 'info': return 'text-rose-gold';
      default: return 'text-emerald-600';
    }
  };

  return (
    // 🎯 تدرج من فوق لتحت (عكس BrandStory)
    <section className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            خليك معانا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            اشترك في النشرة البريدية
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-6" />
          <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
            أول واحد يعرف بكل جديد عندنا. عروض حصرية ومنتجات بتوصلك على بريدك
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {isSubscribed ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 text-center border border-rose-gold/20 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-black mb-2">تعديل البريد</h3>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="البريد الإلكتروني الجديد"
                    className="w-full p-3 rounded-xl border-2 border-rose-gold/20 bg-white text-black font-bold focus:outline-none focus:border-rose-gold transition"
                    dir="ltr"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateEmail}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'جاري...' : 'حفظ التعديل'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 bg-black/10 text-black font-bold rounded-xl hover:bg-black/20 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : showUnsubscribeConfirm ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-black mb-2">متأكد من قرارك؟</h3>
                  <p className="text-black/60">هتخسر العروض والمنتجات الجديدة اللي بننزلها أول بأول</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUnsubscribe}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
                    >
                      {loading ? 'جاري...' : 'نعم، إلغاء الاشتراك'}
                    </button>
                    <button
                      onClick={() => setShowUnsubscribeConfirm(false)}
                      className="flex-1 px-4 py-2 bg-black/10 text-black font-bold rounded-xl hover:bg-black/20 transition"
                    >
                      تراجع
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-black mb-2">أنت معانا يا كبير!</h3>
                  <p className="text-black/60 font-bold">
                    بريدك: <span className="text-rose-gold">{subscribedEmail}</span>
                  </p>
                  <p className="text-black/40 text-sm mt-2">
                    كل جديد في عالم VELIX هيوصلك على طول
                  </p>
                  
                  <div className="flex gap-3 mt-6 justify-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border-2 border-rose-gold/30 text-rose-gold font-bold rounded-xl hover:bg-rose-gold hover:text-white transition text-sm"
                    >
                      تعديل البريد
                    </button>
                    <button
                      onClick={() => setShowUnsubscribeConfirm(true)}
                      className="px-4 py-2 border-2 border-red-300 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition text-sm"
                    >
                      إلغاء الاشتراك
                    </button>
                  </div>
                </>
              )}
              
              {message && (
                <p className={`mt-4 text-center font-bold ${getMessageColor()}`}>
                  {message}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 text-center border border-rose-gold/20 shadow-lg"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="اكتب بريدك الإلكتروني"
                  className="flex-1 h-14 px-4 rounded-xl border-2 border-rose-gold/20 bg-white text-black font-bold focus:outline-none focus:border-rose-gold transition placeholder:text-black/40"
                  required
                  disabled={loading}
                  dir="rtl"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-rose-gold/30"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      جاري...
                    </div>
                  ) : (
                    'اشترك معانا'
                  )}
                </button>
              </form>
              
              {message && (
                <p className={`mt-4 text-center font-bold ${getMessageColor()}`}>
                  {message}
                </p>
              )}
              
              <p className="text-center text-black/40 text-xs mt-6">
                مش هنزعجك بالرسائل الكتير، بس العروض اللي تستاهل
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
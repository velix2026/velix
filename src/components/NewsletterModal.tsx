// components/NewsletterModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('success');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  // منع التمرير خلف المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // جلب البيانات المخزنة
  useEffect(() => {
    const savedEmail = localStorage.getItem('velix_newsletter_email');
    if (savedEmail) {
      setIsSubscribed(true);
      setSubscribedEmail(savedEmail);
      setNewEmail(savedEmail);
    }
  }, []);

  // إغلاق المودال بالـ Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 2000);
      } else if (data.alreadySubscribed) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setNewEmail(email);
        setMessageType('info');
        setMessage('ℹ️ انت مشترك معانا بالفعل، شكراً لدعمك');
        setEmail('');
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 2000);
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
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1500);
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
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1500);
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* المودال */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden">
              
              {/* Header مع زر الإغلاق */}
              <div className="relative bg-linear-to-r from-rose-gold-light via-rose-gold to-copper p-4 text-center">
                <button
                  onClick={onClose}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📧</span>
                  <h3 className="text-lg font-black text-white">النشرة البريدية</h3>
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-6">
                {isSubscribed ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-black">تعديل البريد</h3>
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
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-5xl">✉️</span>
                    </div>
                    <h3 className="text-xl font-black text-black mb-2">اشترك في النشرة البريدية</h3>
                    <p className="text-black/60 text-sm mb-6">
                      أول واحد يعرف بكل جديد عندنا. عروض حصرية ومنتجات جديدة.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="اكتب بريدك الإلكتروني"
                        className="w-full p-3 rounded-xl border-2 border-rose-gold/20 bg-white text-black font-bold focus:outline-none focus:border-rose-gold transition placeholder:text-black/40"
                        required
                        disabled={loading}
                        dir="ltr"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
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
                          'اشترك دلوقتي'
                        )}
                      </button>
                    </form>
                    
                    {message && (
                      <p className={`mt-4 text-center font-bold ${getMessageColor()}`}>
                        {message}
                      </p>
                    )}
                    
                    <p className="text-center text-black/40 text-xs mt-4">
                      مش هنزعجك بالرسائل الكتير، بس العروض اللي تستاهل
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
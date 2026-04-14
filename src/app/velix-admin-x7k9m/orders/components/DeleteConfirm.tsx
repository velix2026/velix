'use client';

interface DeleteConfirmProps {
  order: { order_id: string };
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirm({ order, onConfirm, onClose }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-[90%] md:max-w-sm w-full p-4 md:p-6 text-center border border-rose-gold/20" onClick={(e) => e.stopPropagation()}>
        <div className="text-5xl md:text-6xl mb-4">⚠️</div>
        <h3 className="text-lg md:text-xl font-black text-black mb-2">تأكيد الحذف</h3>
        <p className="text-black/60 text-sm md:text-base mb-4">هل أنت متأكد من حذف الطلب رقم {order.order_id}؟</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm md:text-base hover:bg-red-600 transition-colors">نعم، حذف</button>
          <button onClick={onClose} className="flex-1 bg-rose-gold/10 text-rose-gold py-2 rounded-xl text-sm md:text-base hover:bg-rose-gold/20 transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
}
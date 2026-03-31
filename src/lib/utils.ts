// lib/utils.ts
const toArabicNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '٠';
  const str = num.toString();
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (d) => arabicNumbers[parseInt(d)]);
};

export { toArabicNumber };

export const formatPrice = (price: number | undefined | null): string => {
  // التحقق من صحة السعر
  if (price === undefined || price === null) return '٠ ج.م';
  if (typeof price !== 'number') return '٠ ج.م';
  if (isNaN(price)) return '٠ ج.م';
  
  // تنسيق الرقم مع فواصل الآلاف ورقمين عشريين
  const formattedNumber = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // تحويل الأرقام الإنجليزية إلى عربية
  const arabicNumber = toArabicNumber(formattedNumber);
  
  return `${arabicNumber} ج.م`;
};

export const formatDiscount = (discount: number | undefined | null): string => {
  if (!discount && discount !== 0) return '-٠%';
  return `${toArabicNumber(discount)}%`;
};

export const formatStock = (stock: number | undefined | null): string => {
  if (!stock && stock !== 0) return 'باقي ٠ فقط';
  return `باقي ${toArabicNumber(stock)} فقط`;
};
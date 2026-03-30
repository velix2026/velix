// lib/utils.ts
const toArabicNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '٠';
  const str = num.toString();
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (d) => arabicNumbers[parseInt(d)]);
};

export { toArabicNumber };

export const formatPrice = (price: number | undefined | null): string => {
  if (!price && price !== 0) return '٠ جنيه';
  return `${toArabicNumber(price)} جنيه`;
};

export const formatDiscount = (discount: number | undefined | null): string => {
  if (!discount && discount !== 0) return '-٠%';
  return `${toArabicNumber(discount)}%`;
};

export const formatStock = (stock: number | undefined | null): string => {
  if (!stock && stock !== 0) return 'باقي ٠ فقط';
  return `باقي ${toArabicNumber(stock)} فقط`;
};
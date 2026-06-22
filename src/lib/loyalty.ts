const TIERS = [
  { name: 'bronze', nameAr: 'برونزي', minPoints: 0, maxPoints: 499, multiplier: 1, benefits: ['نقطة لكل جنيه', 'استبدال النقاط من ١٠٠ نقطة'] },
  { name: 'silver', nameAr: 'فضي', minPoints: 500, maxPoints: 1499, multiplier: 1.2, benefits: ['١.٢ نقطة لكل جنيه', 'استبدال النقاط من ١٠٠ نقطة', 'خصم ٥٪ على أول طلب'] },
  { name: 'gold', nameAr: 'ذهبي', minPoints: 1500, maxPoints: 4999, multiplier: 1.5, benefits: ['١.٥ نقطة لكل جنيه', 'استبدال النقاط من ١٠٠ نقطة', 'خصم ١٠٪ على أول طلب', 'أولوية المعالجة'] },
  { name: 'platinum', nameAr: 'بلاتيني', minPoints: 5000, maxPoints: Infinity, multiplier: 2, benefits: ['٢ نقطة لكل جنيه', 'استبدال النقاط من ١٠٠ نقطة', 'خصم ١٥٪ على أول طلب', 'أولوية الشحن', 'توصيل مجاني'] },
];

export function getTier(points: number) {
  const tier = [...TIERS].reverse().find(t => points >= t.minPoints) || TIERS[0];
  const nextTier = TIERS.find(t => t.minPoints > points) || null;
  const pointsToNext = nextTier ? nextTier.minPoints - points : 0;
  const progress = nextTier ? ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100 : 100;
  return { ...tier, nextTierName: nextTier?.nameAr || null, pointsToNext, progress: Math.min(progress, 100) };
}

export function calculatePoints(amount: number, tierName: string) {
  const tier = TIERS.find(t => t.name === tierName) || TIERS[0];
  return Math.floor(amount * tier.multiplier);
}

export function canRedeem(points: number) {
  return points >= 100;
}

export function pointsToEGP(points: number) {
  return (Math.floor(points / 100) * 10);
}

export { TIERS };

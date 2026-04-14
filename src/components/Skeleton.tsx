'use client';

interface ProductCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured';
}

export const ProductCardSkeleton = ({ variant = 'default' }: ProductCardSkeletonProps) => {
  const variants = {
    default: {
      container: "bg-white rounded-2xl shadow-sm overflow-hidden border border-rose-gold/10",
      image: "aspect-square bg-gradient-to-br from-rose-gold/5 to-copper/5",
      padding: "p-4 space-y-3",
      title: "h-4 bg-rose-gold/20 rounded-lg w-3/4",
      price: "h-5 bg-rose-gold/20 rounded-lg w-1/3",
      rating: "h-3 bg-rose-gold/20 rounded-lg w-1/4",
      button: "h-9 bg-rose-gold/20 rounded-xl mt-2"
    },
    compact: {
      container: "bg-white rounded-xl shadow-sm overflow-hidden border border-rose-gold/10",
      image: "aspect-square bg-gradient-to-br from-rose-gold/5 to-copper/5",
      padding: "p-2 space-y-2",
      title: "h-3 bg-rose-gold/20 rounded-lg w-3/4",
      price: "h-4 bg-rose-gold/20 rounded-lg w-1/2",
      rating: "h-2 bg-rose-gold/20 rounded-lg w-1/3",
      button: "h-7 bg-rose-gold/20 rounded-lg mt-1"
    },
    featured: {
      container: "bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-gold/15",
      image: "aspect-[4/3] bg-gradient-to-br from-rose-gold/5 to-copper/5",
      padding: "p-5 space-y-4",
      title: "h-5 bg-rose-gold/20 rounded-lg w-2/3",
      price: "h-6 bg-rose-gold/20 rounded-lg w-1/3",
      rating: "h-4 bg-rose-gold/20 rounded-lg w-1/3",
      button: "h-10 bg-rose-gold/20 rounded-xl mt-3"
    }
  };

  const style = variants[variant];

  return (
    <div className={`${style.container} animate-pulse`} role="status" aria-label="جاري تحميل المنتج">
      <div className={`${style.image} relative overflow-hidden`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-rose-gold/10 to-transparent" />
      </div>
      <div className={style.padding}>
        <div className={style.title} />
        <div className="flex items-center justify-between gap-2">
          <div className={style.price} />
          <div className={style.rating} />
        </div>
        <div className={style.button} />
      </div>
    </div>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  variant?: 'default' | 'compact' | 'featured';
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const ProductGridSkeleton = ({ 
  count = 8, 
  variant = 'default',
}: ProductGridSkeletonProps) => {
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      role="status"
      aria-label="جاري تحميل المنتجات"
    >
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};

// Skeleton for product details page
export const ProductDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-8 md:py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="aspect-square bg-linear-to-br from-rose-gold/5 to-copper/5 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-rose-gold/10 to-transparent" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-rose-gold/5 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-rose-gold/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-rose-gold/20 rounded-lg w-3/4" />
          <div className="h-4 bg-rose-gold/20 rounded-lg w-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 bg-rose-gold/20 rounded-lg w-32" />
          <div className="h-6 bg-rose-gold/20 rounded-lg w-20" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-5 bg-rose-gold/20 rounded-lg w-32" />
          <div className="h-4 bg-rose-gold/20 rounded-lg w-16" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-rose-gold/20 rounded-lg w-full" />
          <div className="h-4 bg-rose-gold/20 rounded-lg w-full" />
          <div className="h-4 bg-rose-gold/20 rounded-lg w-3/4" />
        </div>

        <div className="space-y-3">
          <div className="h-5 bg-rose-gold/20 rounded-lg w-24" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-12 bg-rose-gold/20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-5 bg-rose-gold/20 rounded-lg w-24" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-8 bg-rose-gold/20 rounded-full" />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <div className="h-12 bg-rose-gold/20 rounded-xl flex-1" />
          <div className="h-12 w-12 bg-rose-gold/20 rounded-xl" />
          <div className="h-12 w-12 bg-rose-gold/20 rounded-xl" />
        </div>

        <div className="border-t border-rose-gold/10 pt-6 space-y-3">
          <div className="h-4 bg-rose-gold/20 rounded-lg w-1/2" />
          <div className="h-4 bg-rose-gold/20 rounded-lg w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for cart/favorites items
export const CartItemSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white rounded-xl border border-rose-gold/10 animate-pulse">
    <div className="w-24 h-24 bg-linear-to-br from-rose-gold/5 to-copper/5 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-rose-gold/10 to-transparent" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-rose-gold/20 rounded-lg w-3/4" />
      <div className="h-3 bg-rose-gold/20 rounded-lg w-1/2" />
      <div className="h-5 bg-rose-gold/20 rounded-lg w-1/4" />
    </div>
    <div className="w-8 h-8 bg-rose-gold/20 rounded-full" />
  </div>
);

export const shimmerAnimation = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
`;
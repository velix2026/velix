// components/product/ProductSkeleton.tsx
'use client';

export default function ProductSkeleton() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Skeleton */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
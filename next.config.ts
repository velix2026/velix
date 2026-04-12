import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ أضف الـ formats عشان تحسين الصور
    formats: ['image/avif', 'image/webp'],
    
    // ✅ أضف الـ deviceSizes عشان responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // ✅ أضف الـ imageSizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // ✅ أضف الـ qualities عشان تسمح بجودة 100
    qualities: [75, 100],
    
    // ✅ الـ remotePatterns اللي عندك (حافظ عليها)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
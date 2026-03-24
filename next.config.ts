import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      // إذا كان لديك صور محلية في مجلد public/images
      // لا تحتاج إلى إضافتها لأنها محلية
    ],
  },
};

export default nextConfig;
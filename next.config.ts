import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Default is 1MB, which a real camera/phone photo blows past instantly.
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;

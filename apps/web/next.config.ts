import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "bwawdinzzsmgdhqhxfgn.supabase.co",
        pathname: "/storage/v1/object/**"
      }
    ]
  }
};

export default nextConfig;

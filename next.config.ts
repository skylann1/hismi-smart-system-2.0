import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pntnyljcwkjztwucjznw.supabase.co",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;

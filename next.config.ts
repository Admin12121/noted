import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w.wallhaven.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "images.pump.fun" },
    ],
  },
  // Never statically generate API routes — they all need runtime DB/auth
  experimental: {
    // force all routes to be server-rendered
  },
};

module.exports = nextConfig;

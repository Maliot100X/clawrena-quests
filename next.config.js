/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@three-ws/avatar", "three"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "images.pump.fun" },
    ],
  },
};
module.exports = nextConfig;

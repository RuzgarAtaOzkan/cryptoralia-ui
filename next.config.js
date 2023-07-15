/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  optimizeFont: true,
};

// module.exports = nextConfig;
module.exports = {
  compress: true,
  images: {
    domains: ['ik.imagekit.io'],
  },
};

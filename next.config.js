/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com", "lh3.googleusercontent.com","example.com"],
  },
  // Add this to disable static generation for problematic pages
  output: "standalone",
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      // other redirects
    ];
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

module.exports = nextConfig;

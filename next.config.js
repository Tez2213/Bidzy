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
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "example.com",
    ],
  },
  // Add this to disable static generation for problematic pages
  output: "standalone",
  experimental: {
    // Remove the appDir option as it's no longer needed in Next.js 15
    // appDir was used in earlier Next.js versions when App Router was experimental
  },
  async redirects() {
    return [
      // other redirects
    ];
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // Add any other configuration options you need here
};

module.exports = nextConfig;

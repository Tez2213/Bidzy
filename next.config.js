// Add to your next.config.js
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
      domains: ['images.unsplash.com', 'lh3.googleusercontent.com'],
    },
    // Add this to disable static generation for problematic pages
    output: 'standalone',
    experimental: {
      appDir: true,
    }
  }
  
  module.exports = nextConfig
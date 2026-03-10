/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during build (pre-existing issues)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build (pre-existing issues)
    ignoreBuildErrors: true,
  },

  // Enable gzip compression
  compress: true,

  // Optimized image configuration
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "3001",
  //       pathname: "/uploads/**",
  //     },

  //   ],
  //   // Enable modern image formats
  //   formats: ['image/avif', 'image/webp'],
  //   // Optimized device sizes for responsive images
  //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  //   // Common icon and image sizes
  //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // },


  images: {
    // Allow images from any external source and any format
    unoptimized: true,

    // Responsive device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Common icon/image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental optimizations
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
};

export default nextConfig;
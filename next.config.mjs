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


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   compress: true,

//   // images: {
//   //   unoptimized: true, // optional, keeps your existing behavior
//   //   domains: ['growthvalleyback.b100x.in'], // <-- ADD THIS LINE
//   //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
//   //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//   // },
//   images: {
//     domains: ['res.cloudinary.com'], // allow Cloudinary images
//     unoptimized: false,
//   },
//   experimental: {
//     optimizePackageImports: ['framer-motion', 'react-icons'],
//   },
// };

// export default nextConfig;
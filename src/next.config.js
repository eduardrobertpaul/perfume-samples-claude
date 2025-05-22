/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,
    
    // Enable SWC minification for better performance
    swcMinify: true,
    
    // Experimental features
    experimental: {
      // Enable server components
      serverComponentsExternalPackages: ['@prisma/client'],
    },
    
    // Image optimization
    images: {
      formats: ['image/webp', 'image/avif'],
      domains: [
        'localhost',
        // Add your domain here when deploying
      ],
    },
    
    // Security headers
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ]
    },
    
    // Redirect configuration
    async redirects() {
      return [
        {
          source: '/admin',
          destination: '/admin/dashboard',
          permanent: true,
        },
      ]
    },
    
    // Environment variables
    env: {
      CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    
    // Output configuration for Docker
    output: 'standalone',
    
    // Compiler options
    compiler: {
      // Remove console logs in production
      removeConsole: process.env.NODE_ENV === 'production',
    },
  }
  
  module.exports = nextConfig
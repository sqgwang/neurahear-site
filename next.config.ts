import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  
  // Ensure static files are served correctly
  basePath: '',
  
  // Configure static file serving
  experimental: {
    optimizeCss: true
  },
  // Proxy API requests to the backend server during development
  async rewrites() {
    return [
      {
        source: '/zhanan-api/:path*',
        destination: 'http://localhost:3001/zhanan-api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*',
      },
    ]
  },
}

export default nextConfig

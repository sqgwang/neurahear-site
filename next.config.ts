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
  }
}

export default nextConfig

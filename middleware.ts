import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { join } from 'path';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle Digit-in-Noise test static files
  if (pathname.startsWith('/tools/digit-in-noise-test')) {
    // Remove trailing slash if present (Next.js adds it back)
    const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    
    // If no extension, assume index.html
    const htmlPath = cleanPath.endsWith('.html') ? cleanPath : 
                    cleanPath === '/tools/digit-in-noise-test' ? `${cleanPath}/index.html` :
                    `${cleanPath}.html`;

    // Create URL to the file in the public directory
    const url = new URL('.' + htmlPath, request.url);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tools/digit-in-noise-test/:path*'
  ]
};
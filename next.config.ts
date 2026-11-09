import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [
      { pathname: '/**', search: '' },
      // Published vocabulary images carry a content hash in ?v=.
      // Allow version queries only in this directory of static public assets.
      { pathname: '/images/vocabulary/**' },
    ],
  },
  experimental: {
    typedEnv: true,
  },
  async headers() {
    return [
      {
        // Generated filenames are the SHA-256 of their bytes.
        source: '/images/vocabulary/responsive/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/vocabulary/:path*',
        has: [{ type: 'query', key: 'v', value: '[a-f0-9]{64}' }],
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/ensayo/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
      {
        source: '/audio/oral-final/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

export default nextConfig;

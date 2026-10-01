import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    typedEnv: true,
  },
  async headers() {
    return [
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

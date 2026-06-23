import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'www.manali.today' }],
      destination: 'https://manali.today/:path*',
      permanent: true,
    }]
  },
  outputFileTracingIncludes: {
    '/guide/[slug]': ['./content/guides/**/*'],
    '/blog/[slug]': ['./content/blog/**/*'],
  },
}

export default nextConfig
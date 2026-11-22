import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  // Pretty URLs like /best-cities-in-japan are served by dynamic routes under /best-cities-in/[region]
  async rewrites() {
    return [
      { source: '/best-cities-in-:region', destination: '/best-cities-in/:region' },
      { source: '/cheapest-cities-in-:region', destination: '/cheapest-cities-in/:region' },
      { source: '/cost-of-living-in-:city', destination: '/cost-of-living-in/:city' },
    ];
  },
  async redirects() {
    return [
      // Redirect old Hot Takes slug
      {
        source: '/hot-takes/chiang-mai-thailand-vs-medellin-colombia',
        destination: '/hot-takes/chiang-mai-vs-medellin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

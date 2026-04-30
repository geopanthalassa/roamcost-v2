import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async redirects() {
    return [
      // Redirect /cost-of-living-in-[city] → /city/[city]
      {
        source: '/cost-of-living-in-:city',
        destination: '/city/:city',
        permanent: true,
      },
      // Redirect /cheapest-cities-in-[region] → /cheapest-cities-in-[region] (already exists)
      // Redirect /best-cities-in-[region] → /best-cities-in-[region] (already exists)
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

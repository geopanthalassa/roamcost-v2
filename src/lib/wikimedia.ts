// Fetches city images from Wikimedia/Wikipedia (free, no API key, no rate limits)

import { getCityImage as getStaticImage } from './cityImages';

const cache = new Map<string, string>();

export async function getWikimediaImage(cityName: string, countryName: string, slug: string, width = 800): Promise<string> {
    const cacheKey = slug;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    // First check our curated static map
    const staticImg = getStaticImage(slug, width, Math.round(width * 0.6), cityName);
    if (!staticImg.includes('picsum') && !staticImg.includes('source.unsplash')) {
        return staticImg;
    }

    // Try Wikimedia API for city image
    const queries = [
        `${cityName}`,
        `${cityName}, ${countryName}`,
        `${cityName} city`,
    ];

    for (const query of queries) {
        try {
            const encoded = encodeURIComponent(query.replace(/ /g, '_'));
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
                {
                    headers: { 'User-Agent': 'RoamCost/1.0 (roamcost.com)' },
                    next: { revalidate: 86400 } // cache 24h
                }
            );

            if (!res.ok) continue;
            const data = await res.json();

            const imgUrl = data?.thumbnail?.source || data?.originalimage?.source;
            if (imgUrl && !imgUrl.includes('Flag') && !imgUrl.includes('flag') && !imgUrl.includes('map') && !imgUrl.includes('Map') && !imgUrl.includes('coat') && !imgUrl.includes('Coat') && !imgUrl.includes('logo') && !imgUrl.includes('Logo')) {
                // Get higher resolution version
                const highRes = imgUrl.replace(/\/\d+px-/, `/${width}px-`);
                cache.set(cacheKey, highRes);
                return highRes;
            }
        } catch {
            continue;
        }
    }

    // Final fallback - picsum with seed
    const seed = Math.abs((slug || 'city').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000;
    const fallback = `https://picsum.photos/seed/${seed}/${width}/${Math.round(width * 0.6)}`;
    cache.set(cacheKey, fallback);
    return fallback;
}

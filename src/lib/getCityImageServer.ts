import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

// Server-side function to fetch city images
// Runs at build/request time, not in browser
export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    // 1. Check curated static map first (instant, no API call)
    const staticImg = getCityImage(slug, width, Math.round(width * 0.6), cityName);
    if (CITY_IMAGES_KEYS.includes(slug)) return staticImg;

    // 2. Try Wikipedia API with just the city name (server-side, no CORS)
    const attempts = [
        cityName,
        `${cityName}, ${countryName}`,
        `${cityName} city`,
    ];

    for (const query of attempts) {
        try {
            const encoded = encodeURIComponent(query.replace(/ /g, '_'));
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
                {
                    headers: { 'User-Agent': 'RoamCost/1.0 (roamcost.com)' },
                    next: { revalidate: 604800 }, // cache 7 days
                    signal: AbortSignal.timeout(5000), // 5s timeout
                }
            );
            if (!res.ok) continue;
            const data = await res.json();
            const imgUrl = data?.thumbnail?.source || data?.originalimage?.source;
            if (imgUrl && !/flag|Flag|map|Map|coat|Coat|logo|Logo|seal|Seal|emblem|Emblem|symbol|Symbol|portrait|Portrait|person|Person|people|People|head|Head|face|Face|statue|Statue|vehicle|Vehicle|aircraft|Aircraft|ship|Ship|tool|Tool|machine|Machine|sign|Sign|badge|Badge/i.test(imgUrl)) {
                return imgUrl.replace(/\/\d+px-/, `/${width}px-`);
            }
        } catch {
            continue;
        }
    }

    // 3. Fallback to Unsplash by city name
    const query = encodeURIComponent(cityName + ' city skyline');
    return `https://source.unsplash.com/${width}x${Math.round(width * 0.6)}/?${query}`;
}

// List of slugs that have curated images

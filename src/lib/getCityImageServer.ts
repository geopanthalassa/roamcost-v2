import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    // 1. Always check curated map first — instant, guaranteed correct photo
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, width, Math.round(width * 0.6), cityName);
    }

    // 2. Also check common slug variants
    const variants = [
        slug,
        `${slug}-${countryName.toLowerCase().replace(/[^a-z]/g, '-')}`,
        cityName.toLowerCase().replace(/[^a-z]/g, '-'),
    ];
    for (const v of variants) {
        if (CITY_IMAGES_KEYS.includes(v)) {
            return getCityImage(v, width, Math.round(width * 0.6), cityName);
        }
    }

    // 3. Wikipedia — only for cities not in our map
    // Use strict filter to avoid person/object photos
    const attempts = [cityName, `${cityName} city`];
    for (const query of attempts) {
        try {
            const encoded = encodeURIComponent(query.replace(/ /g, '_'));
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
                {
                    headers: { 'User-Agent': 'RoamCost/1.0 (roamcost.com)' },
                    next: { revalidate: 604800 },
                    signal: AbortSignal.timeout(3000),
                }
            );
            if (!res.ok) continue;
            const data = await res.json();
            // Only use if it's clearly a city/place article
            if (data?.type !== 'standard' && data?.type !== 'disambiguation') continue;
            if (!data?.description?.toLowerCase().match(/city|capital|town|municipality|metropolitan/)) continue;

            const imgUrl = data?.thumbnail?.source;
            if (imgUrl && !/flag|Flag|map|Map|coat|Coat|logo|Logo|seal|Seal|emblem|person|people|portrait|face|head|statue|vehicle|tool|machine|sign|badge|laboratory|lab/i.test(imgUrl)) {
                return imgUrl.replace(/\/\d+px-/, `/${width}px-`);
            }
        } catch {
            continue;
        }
    }

    // 4. Final fallback — generic city photo from Unsplash (always works)
    const seed = Math.abs((slug || 'city').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 10;
    const fallbacks = [
        'photo-1477959858617-67f85cf4f1df', // chicago skyline
        'photo-1502602898657-3e91760cbb34', // paris
        'photo-1506973035872-a4ec16b8e8d9', // sydney
        'photo-1524231757912-21f4fe3a7200', // istanbul
        'photo-1540959733332-eab4deabeeaf', // tokyo
        'photo-1474181487882-5abf3f0ba6c2', // shanghai
        'photo-1560969184-10fe8719e047',     // berlin
        'photo-1512470876302-972faa2aa9a4', // amsterdam
        'photo-1525625293386-3f8f99389edd', // singapore
        'photo-1580060839134-75a5edca2e99', // cape town
    ];
    const photoId = fallbacks[seed];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 0.6)}&q=80`;
}

// v8 - curated map + Wikipedia API server-side (works from Render) + urban pool fallback
import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

const URBAN_POOL = [
    'photo-1477959858617-67f85cf4f1df', 'photo-1502602898657-3e91760cbb34',
    'photo-1513635269975-59663e0ac1ad', 'photo-1474181487882-5abf3f0ba6c2',
    'photo-1512470876302-972faa2aa9a4', 'photo-1525625293386-3f8f99389edd',
    'photo-1560969184-10fe8719e047', 'photo-1512453979798-5ea266f8880c',
    'photo-1506973035872-a4ec16b8e8d9', 'photo-1524231757912-21f4fe3a7200',
    'photo-1540959733332-eab4deabeeaf', 'photo-1601621915196-2621bfb0cd6e',
    'photo-1590559899731-a382839e5549', 'photo-1508009603885-50cf7c579365',
    'photo-1596422846543-75c6fc197f07', 'photo-1483729558449-99ef09a8c325',
    'photo-1589909202802-8f4aadce9d55', 'photo-1619546813926-a78fa6372cd2',
    'photo-1585464231875-d9ef1f5ad396', 'photo-1517935706615-2717063c2225',
    'photo-1496442226666-8d4d0e62e6e9', 'photo-1516550135131-fe3dcdd41517',
    'photo-1549517045-bc93de075e53', 'photo-1541849546-216549ae216d',
    'photo-1607427293702-036933bbf746', 'photo-1509356843151-3e7d96241e11',
    'photo-1555993539-1732b0258235', 'photo-1552832230-c0197dd311b5',
    'photo-1539037116277-4db20889f2d4', 'photo-1523531294919-4bcd7c65e216',
    'photo-1580060839134-75a5edca2e99', 'photo-1597212720156-b0a6ae05e3aa',
    'photo-1514395462421-22b2f9f6b81c', 'photo-1507699622108-4be3abd695ad',
    'photo-1585208798174-6cedd4454069', 'photo-1608031751869-893e5e0bd97e',
    'photo-1513622470522-26c3c8a854bc', 'photo-1531366936337-7c912a4589a7',
    'photo-1534190760961-74e8c1c5c3da', 'photo-1619946794135-5bc917a27793',
    'photo-1508804185872-d7badad00f7d', 'photo-1536431311719-398b6704d4cc',
    'photo-1570168007204-dfb528c6958f', 'photo-1559511260-b120d11350cf',
    'photo-1606924248585-c04f1c737b90', 'photo-1611348586804-61bf6c080437',
    'photo-1577948000111-9c970dfe3743', 'photo-1575547991-c7f97cd4ea08',
    'photo-1539650116574-8efeb43e2750', 'photo-1537996194471-e657df975ab4',
];

// Cities that Wikipedia gives bad photos for (flags, coats of arms, maps)
const WIKIPEDIA_BLOCKLIST = new Set([
    'abuja', 'kinshasa', 'luanda', 'brazzaville', 'bamako', 'niamey', 
    'ouagadougou', 'bangui', 'ndjamena', 'conakry', 'freetown', 'monrovia',
]);

async function tryWikipedia(cityName: string, countryName: string): Promise<string | null> {
    const queries = [
        `${cityName}`,
        `${cityName}, ${countryName}`,
    ];
    
    for (const q of queries) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q.replace(/ /g, '_'))}`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'RoamCost/1.0 (https://roamcost.com)' },
                signal: AbortSignal.timeout(3000),
                next: { revalidate: 2592000 }, // cache 30 days
            });
            if (!res.ok) continue;
            const data = await res.json();
            const imgUrl = data?.originalimage?.source || data?.thumbnail?.source;
            if (!imgUrl) continue;
            // Block flags, maps, coats of arms, logos, people
            if (imgUrl.match(/flag|Flag|map|Map|coat|Coat|arms|Arms|logo|Logo|seal|Seal|portrait|Portrait|person|_\d+px/i)) continue;
            // Must be a real photo (jpg/png/webp)
            if (!imgUrl.match(/\.(jpg|jpeg|png|webp)/i)) continue;
            // Resize to a reasonable size
            const sized = imgUrl.replace(/\/\d+px-/, '/1200px-');
            return sized;
        } catch {
            continue;
        }
    }
    return null;
}

export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    const h = Math.round(width * 0.6);

    // 1. Curated map — always correct
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, width, h, cityName);
    }

    // 2. Try slug variants
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    for (const v of [clean(cityName), `${clean(cityName)}-${clean(countryName)}`, `${slug}-${clean(countryName)}`]) {
        if (CITY_IMAGES_KEYS.includes(v)) return getCityImage(v, width, h, cityName);
    }

    // 3. Wikipedia server-side (works from Render, cached 30 days)
    if (!WIKIPEDIA_BLOCKLIST.has(slug)) {
        const wikiUrl = await tryWikipedia(cityName, countryName);
        if (wikiUrl) return wikiUrl;
    }

    // 4. Deterministic pool fallback — always a city skyline
    const hash = Math.abs(`${cityName}-${countryName}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0));
    const photoId = URBAN_POOL[hash % URBAN_POOL.length];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${h}&q=80`;
}

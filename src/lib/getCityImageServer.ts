import { getCityImage } from './cityImages';

// Server-side function to fetch city images
// Runs at build/request time, not in browser
export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    // 1. Check curated static map first
    const staticImg = getCityImage(slug, width, Math.round(width * 0.6), cityName);
    const isStatic = CITY_IMAGES_KEYS.includes(slug);
    if (isStatic) return staticImg;

    // 2. Try Wikipedia API (server-side, no CORS issues)
    const attempts = [
        cityName,
        `${cityName},_${countryName.replace(/ /g, '_')}`,
        `${cityName}_city`,
    ];

    for (const query of attempts) {
        try {
            const encoded = encodeURIComponent(query);
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
                {
                    headers: { 'User-Agent': 'RoamCost/1.0 (roamcost.com)' },
                    next: { revalidate: 604800 } // cache 7 days
                }
            );
            if (!res.ok) continue;
            const data = await res.json();
            const imgUrl = data?.thumbnail?.source || data?.originalimage?.source;
            if (imgUrl && !/flag|Flag|map|Map|coat|Coat|logo|Logo|seal|Seal/i.test(imgUrl)) {
                return imgUrl.replace(/\/\d+px-/, `/${width}px-`);
            }
        } catch {
            continue;
        }
    }

    // 3. Fallback
    return staticImg;
}

// List of slugs that have curated images
const CITY_IMAGES_KEYS = [
    'new-york','los-angeles','chicago','miami','toronto','vancouver','mexico-city',
    'buenos-aires','sao-paulo','rio-de-janeiro','bogota','lima','santiago-chile',
    'santiago','montevideo','medellin','london','paris','berlin','madrid','barcelona',
    'rome','milan','amsterdam','brussels','vienna','zurich','lisbon','lisboa','porto',
    'prague','warsaw','budapest','stockholm','copenhagen','oslo','helsinki','athens',
    'dublin','edinburgh','munich','hamburg','frankfurt','geneva','lyon','marseille',
    'valencia','seville','florence','venice','tokyo','osaka','kyoto','seoul','beijing',
    'shanghai','hong-kong','singapore','bangkok','dubai','mumbai','delhi','bangalore',
    'kuala-lumpur','jakarta','bali','manila','taipei','ho-chi-minh-city','hanoi',
    'istanbul','tel-aviv','riyadh','doha','sydney','melbourne','auckland','cape-town',
    'johannesburg','nairobi','cairo','casablanca','marrakech',
];

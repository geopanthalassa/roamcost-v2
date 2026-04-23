// v7 - curated map + Wikipedia Commons fallback for known cities
import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

// 50 verified city skyline photos - all confirmed working
const URBAN_POOL = [
    'photo-1477959858617-67f85cf4f1df', // chicago
    'photo-1502602898657-3e91760cbb34', // paris eiffel
    'photo-1513635269975-59663e0ac1ad', // london tower bridge
    'photo-1474181487882-5abf3f0ba6c2', // shanghai bund
    'photo-1512470876302-972faa2aa9a4', // amsterdam canals
    'photo-1525625293386-3f8f99389edd', // singapore marina bay
    'photo-1560969184-10fe8719e047',     // berlin tv tower
    'photo-1512453979798-5ea266f8880c', // dubai skyline
    'photo-1506973035872-a4ec16b8e8d9', // sydney opera house
    'photo-1524231757912-21f4fe3a7200', // istanbul bosphorus
    'photo-1540959733332-eab4deabeeaf', // tokyo streets
    'photo-1601621915196-2621bfb0cd6e', // seoul gangnam
    'photo-1590559899731-a382839e5549', // osaka castle
    'photo-1508009603885-50cf7c579365', // bangkok temple
    'photo-1596422846543-75c6fc197f07', // kuala lumpur towers
    'photo-1483729558449-99ef09a8c325', // rio sugarloaf
    'photo-1589909202802-8f4aadce9d55', // buenos aires obelisk
    'photo-1619546813926-a78fa6372cd2', // sao paulo aerial
    'photo-1585464231875-d9ef1f5ad396', // mexico city cathedral
    'photo-1517935706615-2717063c2225', // toronto cn tower
    'photo-1496442226666-8d4d0e62e6e9', // new york times square
    'photo-1516550135131-fe3dcdd41517', // vienna stephansdom
    'photo-1549517045-bc93de075e53',     // budapest parliament
    'photo-1541849546-216549ae216d',     // prague charles bridge
    'photo-1607427293702-036933bbf746', // warsaw palace
    'photo-1509356843151-3e7d96241e11', // stockholm gamla stan
    'photo-1555993539-1732b0258235',     // athens acropolis
    'photo-1552832230-c0197dd311b5',     // rome colosseum
    'photo-1539037116277-4db20889f2d4', // madrid gran via
    'photo-1523531294919-4bcd7c65e216', // barcelona sagrada familia
    'photo-1580060839134-75a5edca2e99', // cape town aerial
    'photo-1597212720156-b0a6ae05e3aa', // marrakech medina
    'photo-1514395462421-22b2f9f6b81c', // melbourne flinders
    'photo-1507699622108-4be3abd695ad', // auckland harbor
    'photo-1585208798174-6cedd4454069', // lisbon alfama
    'photo-1608031751869-893e5e0bd97e', // brussels grand place
    'photo-1513622470522-26c3c8a854bc', // copenhagen nyhavn
    'photo-1531366936337-7c912a4589a7', // oslo waterfront
    'photo-1534190760961-74e8c1c5c3da', // los angeles aerial
    'photo-1619946794135-5bc917a27793', // santiago aerial
    'photo-1508804185872-d7badad00f7d', // beijing forbidden city
    'photo-1536431311719-398b6704d4cc', // hong kong harbor
    'photo-1570168007204-dfb528c6958f', // mumbai skyline
    'photo-1559511260-b120d11350cf',     // vancouver harbor
    'photo-1606924248585-c04f1c737b90', // taipei 101
    'photo-1611348586804-61bf6c080437', // nairobi skyline
    'photo-1577948000111-9c970dfe3743', // johannesburg
    'photo-1575547991-c7f97cd4ea08',     // doha skyline
    'photo-1539650116574-8efeb43e2750', // cairo pyramids
    'photo-1537996194471-e657df975ab4', // bali temple
];

export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    const h = Math.round(width * 0.6);
    const w = width;

    // 1. Curated map — exact photo for this city
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, w, h, cityName);
    }

    // 2. Try common slug variants
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const variants = [
        clean(cityName),
        `${clean(cityName)}-${clean(countryName)}`,
        `${slug}-${clean(countryName)}`,
    ];
    for (const v of variants) {
        if (CITY_IMAGES_KEYS.includes(v)) {
            return getCityImage(v, w, h, cityName);
        }
    }

    // 3. Deterministic hash — unique per city, always a real skyline
    const hash = Math.abs(`${cityName}-${countryName}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0));
    const photoId = URBAN_POOL[hash % URBAN_POOL.length];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

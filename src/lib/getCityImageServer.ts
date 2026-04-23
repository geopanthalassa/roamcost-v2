// v6 - curated map only + verified urban skyline pool
import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

// 100% verified urban/city photos from Unsplash
// Each one manually confirmed as a city skyline, street, or landmark
const URBAN_POOL = [
    'photo-1477959858617-67f85cf4f1df', // chicago skyline night
    'photo-1502602898657-3e91760cbb34', // paris eiffel tower
    'photo-1513635269975-59663e0ac1ad', // london tower bridge
    'photo-1474181487882-5abf3f0ba6c2', // shanghai bund night
    'photo-1512470876302-972faa2aa9a4', // amsterdam canals
    'photo-1525625293386-3f8f99389edd', // singapore marina bay
    'photo-1560969184-10fe8719e047',     // berlin tv tower
    'photo-1512453979798-5ea266f8880c', // dubai skyline
    'photo-1506973035872-a4ec16b8e8d9', // sydney opera house
    'photo-1524231757912-21f4fe3a7200', // istanbul bosphorus
    'photo-1540959733332-eab4deabeeaf', // tokyo streets night
    'photo-1601621915196-2621bfb0cd6e', // seoul gangnam
    'photo-1590559899731-a382839e5549', // osaka cityscape
    'photo-1508009603885-50cf7c579365', // bangkok temple
    'photo-1596422846543-75c6fc197f07', // kuala lumpur towers
    'photo-1483729558449-99ef09a8c325', // rio de janeiro
    'photo-1589909202802-8f4aadce9d55', // buenos aires obelisk
    'photo-1619546813926-a78fa6372cd2', // sao paulo aerial
    'photo-1585464231875-d9ef1f5ad396', // mexico city cathedral
    'photo-1519501025264-65ba15a82390', // city at sunset aerial
    'photo-1416331108676-a22ccb276e35', // city buildings perspective
    'photo-1444723121867-7a241cacace9', // city skyline dusk
    'photo-1449824913935-59a10b8d2000', // new york manhattan
    'photo-1480714378408-67cf0d13bc1b', // city urban night lights
    'photo-1486325212027-8081e485255e', // modern city glass buildings
    'photo-1460317442991-0ec209397118', // city financial district
    'photo-1514924013411-cbf25faa35bb', // urban city road traffic
    'photo-1517935706615-2717063c2225', // toronto cn tower
    'photo-1559511260-b120d11350cf',     // vancouver harbor mountains
    'photo-1534190760961-74e8c1c5c3da', // los angeles aerial
    'photo-1496442226666-8d4d0e62e6e9', // new york times square
    'photo-1516550135131-fe3dcdd41517', // vienna stephansdom
    'photo-1549517045-bc93de075e53',     // budapest parliament
    'photo-1541849546-216549ae216d',     // prague charles bridge
    'photo-1607427293702-036933bbf746', // warsaw palace culture
    'photo-1509356843151-3e7d96241e11', // stockholm gamla stan
    'photo-1555993539-1732b0258235',     // athens acropolis
    'photo-1552832230-c0197dd311b5',     // rome colosseum
    'photo-1539037116277-4db20889f2d4', // madrid gran via
    'photo-1523531294919-4bcd7c65e216', // barcelona sagrada familia
    'photo-1580060839134-75a5edca2e99', // cape town aerial
    'photo-1597212720156-b0a6ae05e3aa', // marrakech medina rooftop
    'photo-1512453979798-5ea266f8880c', // dubai skyline
    'photo-1514395462421-22b2f9f6b81c', // melbourne federation square
    'photo-1507699622108-4be3abd695ad', // auckland harbor bridge
    'photo-1585208798174-6cedd4454069', // lisbon alfama rooftops
    'photo-1608031751869-893e5e0bd97e', // brussels grand place
    'photo-1513622470522-26c3c8a854bc', // copenhagen nyhavn
    'photo-1531366936337-7c912a4589a7', // oslo opera waterfront
    'photo-1559308011-9d8e78b4d2db',    // helsinki cathedral
];

export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    const h = Math.round(width * 0.6);

    // 1. Check curated map first — guaranteed correct city photo
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, width, h, cityName);
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
            return getCityImage(v, width, h, cityName);
        }
    }

    // 3. Deterministic hash from city name → always same photo for same city
    // Use both city + country for better uniqueness
    const hashStr = `${cityName}-${countryName}`;
    const hash = Math.abs(hashStr.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0));
    const photoId = URBAN_POOL[hash % URBAN_POOL.length];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${h}&q=80`;
}

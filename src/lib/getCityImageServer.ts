import { getCityImage, CITY_IMAGES_KEYS } from './cityImages';

// Regional fallback photos - guaranteed city skylines
const REGIONAL_FALLBACKS: Record<string, string[]> = {
    africa: [
        'photo-1580060839134-75a5edca2e99', // cape town
        'photo-1577948000111-9c970dfe3743', // johannesburg
        'photo-1611348586804-61bf6c080437', // nairobi
        'photo-1539650116574-8efeb43e2750', // cairo
        'photo-1597212720156-b0a6ae05e3aa', // marrakech
    ],
    asia: [
        'photo-1540959733332-eab4deabeeaf', // tokyo
        'photo-1474181487882-5abf3f0ba6c2', // shanghai
        'photo-1525625293386-3f8f99389edd', // singapore
        'photo-1508009603885-50cf7c579365', // bangkok
        'photo-1596422846543-75c6fc197f07', // kuala lumpur
    ],
    europe: [
        'photo-1502602898657-3e91760cbb34', // paris
        'photo-1513635269975-59663e0ac1ad', // london
        'photo-1560969184-10fe8719e047', // berlin
        'photo-1512470876302-972faa2aa9a4', // amsterdam
        'photo-1585208798174-6cedd4454069', // lisbon
    ],
    americas: [
        'photo-1496442226666-8d4d0e62e6e9', // new york
        'photo-1483729558449-99ef09a8c325', // rio
        'photo-1589909202802-8f4aadce9d55', // buenos aires
        'photo-1585464231875-d9ef1f5ad396', // mexico city
        'photo-1559511260-b120d11350cf', // vancouver
    ],
    middleeast: [
        'photo-1512453979798-5ea266f8880c', // dubai
        'photo-1586724237569-f3d0c1dee8c6', // riyadh
        'photo-1539650116574-8efeb43e2750', // cairo
        'photo-1524231757912-21f4fe3a7200', // istanbul
        'photo-1544473244-f5a282bdfed4', // tel aviv
    ],
    oceania: [
        'photo-1506973035872-a4ec16b8e8d9', // sydney
        'photo-1514395462421-22b2f9f6b81c', // melbourne
        'photo-1507699622108-4be3abd695ad', // auckland
    ],
    default: [
        'photo-1477959858617-67f85cf4f1df', // chicago
        'photo-1506973035872-a4ec16b8e8d9', // sydney
        'photo-1524231757912-21f4fe3a7200', // istanbul
        'photo-1540959733332-eab4deabeeaf', // tokyo
        'photo-1502602898657-3e91760cbb34', // paris
        'photo-1513635269975-59663e0ac1ad', // london
        'photo-1474181487882-5abf3f0ba6c2', // shanghai
        'photo-1512470876302-972faa2aa9a4', // amsterdam
        'photo-1525625293386-3f8f99389edd', // singapore
        'photo-1560969184-10fe8719e047', // berlin
    ],
};

const AFRICA_COUNTRIES = ['Nigeria','Angola','Mali','Congo','Ethiopia','Tanzania','Uganda','Ghana','Senegal','Sudan','Algeria','Tunisia','Libya','Rwanda','Zimbabwe','Zambia','Mozambique','Cameroon','Ivory Coast'];
const ASIA_COUNTRIES = ['Japan','China','South Korea','Taiwan','Singapore','Thailand','Malaysia','Indonesia','Vietnam','Philippines','India','Bangladesh','Pakistan','Sri Lanka','Nepal','Cambodia','Myanmar','Laos','Mongolia'];
const MIDDLEEAST_COUNTRIES = ['United Arab Emirates','Saudi Arabia','Israel','Qatar','Kuwait','Bahrain','Oman','Jordan','Lebanon','Iraq','Iran'];
const OCEANIA_COUNTRIES = ['Australia','New Zealand','Papua New Guinea','Fiji'];
const AMERICAS_COUNTRIES = ['United States','Canada','Mexico','Brazil','Argentina','Colombia','Chile','Peru','Venezuela','Ecuador','Bolivia','Paraguay','Uruguay','Cuba'];

function getRegionalFallback(countryName: string, slug: string): string {
    const seed = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    
    let pool = REGIONAL_FALLBACKS.default;
    if (AFRICA_COUNTRIES.some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.africa;
    else if (ASIA_COUNTRIES.some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.asia;
    else if (MIDDLEEAST_COUNTRIES.some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.middleeast;
    else if (OCEANIA_COUNTRIES.some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.oceania;
    else if (AMERICAS_COUNTRIES.some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.americas;
    else if (['United Kingdom','Germany','France','Spain','Italy','Netherlands','Portugal','Poland','Sweden','Norway','Denmark','Finland','Austria','Switzerland','Belgium','Greece','Ireland','Czech Republic','Hungary','Romania'].some(c => countryName.includes(c))) pool = REGIONAL_FALLBACKS.europe;

    const photoId = pool[seed % pool.length];
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&h=500&q=80`;
}

export async function getCityImageServer(
    slug: string,
    cityName: string,
    countryName: string,
    width = 800
): Promise<string> {
    // 1. Check curated static map — always correct photo
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, width, Math.round(width * 0.6), cityName);
    }

    // 2. Check slug variants
    const slugVariants = [
        `${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`,
        `${slug}-${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`,
    ];
    for (const v of slugVariants) {
        if (CITY_IMAGES_KEYS.includes(v)) {
            return getCityImage(v, width, Math.round(width * 0.6), cityName);
        }
    }

    // 3. Regional fallback - guaranteed city photo, no Wikipedia
    return getRegionalFallback(countryName, slug);
}

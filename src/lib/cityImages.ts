// Curated Unsplash photo IDs for popular cities
// Format: slug -> unsplash photo ID
export const CITY_IMAGES: Record<string, string> = {
    // Americas
    'new-york': 'photo-1496442226666-8d4d0e62e6e9',
    'los-angeles': 'photo-1534190760961-74e8c1c5c3da',
    'chicago': 'photo-1477959858617-67f85cf4f1df',
    'miami': 'photo-1506905925346-21bda4d32df4',
    'toronto': 'photo-1517935706615-2717063c2225',
    'vancouver': 'photo-1559511260-b120d11350cf',
    'mexico-city': 'photo-1585464231875-d9ef1f5ad396',
    'buenos-aires': 'photo-1589909202802-8f4aadce9d55',
    'sao-paulo': 'photo-1619546813926-a78fa6372cd2',
    'rio-de-janeiro': 'photo-1483729558449-99ef09a8c325',
    'bogota': 'photo-1589923188900-85dae523342b',
    'lima': 'photo-1531968455001-5c5272a41129',
    'santiago-chile': 'photo-1619946794135-5bc917a27793',
    'montevideo': 'photo-1568158879083-c42860933ed7',

    // Europe
    'london': 'photo-1513635269975-59663e0ac1ad',
    'paris': 'photo-1502602898657-3e91760cbb34',
    'berlin': 'photo-1560969184-10fe8719e047',
    'madrid': 'photo-1539037116277-4db20889f2d4',
    'barcelona': 'photo-1523531294919-4bcd7c65e216',
    'rome': 'photo-1552832230-c0197dd311b5',
    'milan': 'photo-1603122630570-d07a2294a746',
    'amsterdam': 'photo-1512470876302-972faa2aa9a4',
    'brussels': 'photo-1608031751869-893e5e0bd97e',
    'vienna': 'photo-1516550135131-fe3dcdd41517',
    'zurich': 'photo-1515488764276-beab7607c1e6',
    'lisbon': 'photo-1585208798174-6cedd4454069',
    'porto': 'photo-1555881400-74d7acaacd8b',
    'prague': 'photo-1541849546-216549ae216d',
    'warsaw': 'photo-1607427293702-036933bbf746',
    'budapest': 'photo-1549517045-bc93de075e53',
    'stockholm': 'photo-1509356843151-3e7d96241e11',
    'copenhagen': 'photo-1513622470522-26c3c8a854bc',
    'oslo': 'photo-1531366936337-7c912a4589a7',
    'helsinki': 'photo-1559308011-9d8e78b4d2db',
    'athens': 'photo-1555993539-1732b0258235',

    // Asia
    'tokyo': 'photo-1540959733332-eab4deabeeaf',
    'osaka': 'photo-1590559899731-a382839e5549',
    'seoul': 'photo-1601621915196-2621bfb0cd6e',
    'beijing': 'photo-1508804185872-d7badad00f7d',
    'shanghai': 'photo-1474181487882-5abf3f0ba6c2',
    'hong-kong': 'photo-1536431311719-398b6704d4cc',
    'singapore': 'photo-1525625293386-3f8f99389edd',
    'bangkok': 'photo-1508009603885-50cf7c579365',
    'dubai': 'photo-1512453979798-5ea266f8880c',
    'abu-dhabi': 'photo-1600240644455-3edc55c375fe',
    'mumbai': 'photo-1570168007204-dfb528c6958f',
    'delhi': 'photo-1555952517-2e8e729e0b44',
    'kuala-lumpur': 'photo-1596422846543-75c6fc197f07',
    'jakarta': 'photo-1555217851-6141535bd771',
    'manila': 'photo-1518548419970-58e3b4079ab2',
    'taipei': 'photo-1506905925346-21bda4d32df4',
    'ho-chi-minh-city': 'photo-1583417267826-aebc4d1542e1',
    'hanoi': 'photo-1528360983277-13d401cdc186',
    'istanbul': 'photo-1524231757912-21f4fe3a7200',
    'tel-aviv': 'photo-1544473244-f5a282bdfed4',
    'riyadh': 'photo-1586724237569-f3d0c1dee8c6',

    // Africa & Oceania
    'sydney': 'photo-1506973035872-a4ec16b8e8d9',
    'melbourne': 'photo-1514395462421-22b2f9f6b81c',
    'auckland': 'photo-1507699622108-4be3abd695ad',
    'cape-town': 'photo-1580060839134-75a5edca2e99',
    'johannesburg': 'photo-1577948000111-9c970dfe3743',
    'nairobi': 'photo-1611348586804-61bf6c080437',
    'cairo': 'photo-1539650116574-8efeb43e2750',
    'casablanca': 'photo-1597212720156-b0a6ae05e3aa',
};

export function getCityImage(slug: string, width = 800, height = 600): string {
    const photoId = CITY_IMAGES[slug];
    if (photoId) {
        return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
    }
    // Fallback: picsum with consistent seed
    const seed = Math.abs((slug || 'city').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000;
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

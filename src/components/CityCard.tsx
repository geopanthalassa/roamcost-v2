'use client';

import Link from 'next/link';
import { City } from '@/types/database';
import { useCurrency } from '@/context/CurrencyContext';
import { getCityImage, CITY_IMAGES_KEYS } from '@/lib/cityImages';

interface CityCardProps {
    city: City;
    preloadedImage?: string;
}

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

function getImageUrl(slug: string, cityName: string, countryName: string): string {
    // 1. Curated map
    if (CITY_IMAGES_KEYS.includes(slug)) {
        return getCityImage(slug, 800, 500, cityName);
    }
    // 2. Variants
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    for (const v of [clean(cityName), `${clean(cityName)}-${clean(countryName)}`]) {
        if (CITY_IMAGES_KEYS.includes(v)) return getCityImage(v, 800, 500, cityName);
    }
    // 3. Deterministic pool
    const hash = Math.abs(`${cityName}-${countryName}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0));
    return `https://images.unsplash.com/${URBAN_POOL[hash % URBAN_POOL.length]}?auto=format&fit=crop&w=800&h=500&q=80`;
}

export default function CityCard({ city, preloadedImage }: CityCardProps) {
    const { formatValue } = useCurrency();
    const estimatedMonthly = (city.rent_index ?? 0) + ((city.food_index ?? 0) * 30) + (city.transport_index ?? 0) + (city.utilities_index ?? 0);
    const hasData = estimatedMonthly > 0;
    const imageUrl = preloadedImage || getImageUrl(city.slug, city.city, city.country);
    const safetyColor = (city.safety ?? 0) >= 7 ? '#40916C' : (city.safety ?? 0) >= 5 ? '#d97706' : '#dc2626';
    const internetLabel = (city.internet ?? 0) >= 50 ? 'Fast' : (city.internet ?? 0) >= 20 ? 'Good' : (city.internet ?? 0) > 0 ? 'Slow' : null;

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '1px solid #e2e8f0', boxShadow: 'none', background: '#ffffff',
            borderRadius: 'var(--radius-md)', textDecoration: 'none'
        }}>
            {/* Use <img> tag instead of background-image — works correctly with Unsplash */}
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <img
                    src={imageUrl}
                    alt={city.city}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    loading="lazy"
                />
                {internetLabel && (
                    <div style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
                        padding: '0.25rem 0.6rem', borderRadius: '6px',
                        fontSize: '0.7rem', fontWeight: 700
                    }}>
                        {internetLabel}
                    </div>
                )}
            </div>
            <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{city.city}</h3>
                    <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country}</p>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Est. Monthly</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                        {hasData ? formatValue(estimatedMonthly) : 'N/A'}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(city.safety ?? 0) > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: safetyColor, fontWeight: 700 }}>
                            Safety {city.safety}/10
                        </span>
                    )}
                    {(city.internet ?? 0) > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                            {city.internet} Mbps
                        </span>
                    )}
                    {(city.cost_index ?? 0) > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#F0FAF4', color: '#52B788', fontWeight: 700 }}>
                            Score {Math.round(city.cost_index)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

'use client';

import Link from 'next/link';
import { City } from '@/types/database';
import { useCurrency } from '@/context/CurrencyContext';

interface CityCardProps {
    city: City;
}

export default function CityCard({ city }: CityCardProps) {
    const { formatValue } = useCurrency();

    // Better imagery: use city name and a fallback pattern
    const imageUrl = `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800&q=80`;
    // We'll use a dynamic one based on city but with more robust keywords
    const dynamicImage = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(city.city)},${encodeURIComponent(city.country)},cityscape`;

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            boxShadow: 'var(--shadow-md)',
            background: 'var(--card)'
        }}>
            <div style={{
                height: '220px',
                backgroundColor: 'var(--primary)',
                backgroundImage: `url(${dynamicImage}), url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease'
            }} />
            <div style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--foreground)' }}>{city.city}</h3>
                        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>{city.country}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            RENT: {formatValue(city.rent_index * 10)}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            SAFETY: {city.safety}/100
                        </span>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--foreground)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 900,
                        boxShadow: '0 2px 4px rgba(251, 191, 36, 0.3)'
                    }}>
                        {city.cost_index}
                    </div>
                </div>
            </div>
        </Link>
    );
}

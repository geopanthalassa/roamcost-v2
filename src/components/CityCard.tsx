'use client';

import Link from 'next/link';
import { City } from '@/types/database';
import { useCurrency } from '@/context/CurrencyContext';
import { getCityImage } from '@/lib/cityImages';

interface CityCardProps {
    city: City;
}

export default function CityCard({ city }: CityCardProps) {
    const { formatValue } = useCurrency();

    const estimatedMonthly = (city.rent_index ?? 0) + ((city.food_index ?? 0) * 30) + (city.transport_index ?? 0) + (city.utilities_index ?? 0);
    const dynamicImage = getCityImage(city.slug, 800, 600);

    const safetyColor = city.safety >= 7 ? '#0ea5a0' : city.safety >= 5 ? '#d97706' : '#dc2626';
    const internetLabel = city.internet >= 50 ? 'Fast' : city.internet >= 20 ? 'Good' : city.internet > 0 ? 'Slow' : null;
    const hasData = estimatedMonthly > 0;

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '1px solid #e2e8f0', boxShadow: 'none', background: '#ffffff',
            borderRadius: 'var(--radius-md)', textDecoration: 'none'
        }}>
            <div style={{
                height: '200px',
                backgroundColor: '#f1f5f9',
                backgroundImage: `url(${dynamicImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
                position: 'relative'
            }}>
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

            <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{city.city}</h3>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country}</p>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Est. Monthly</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                        {hasData ? formatValue(estimatedMonthly) : 'N/A'}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {city.safety > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: safetyColor, fontWeight: 700 }}>
                            Safety {city.safety}/10
                        </span>
                    )}
                    {city.internet > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                            {city.internet} Mbps
                        </span>
                    )}
                    {city.cost_index > 0 && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#f0fdfc', color: '#2BC0B4', fontWeight: 700 }}>
                            Score {Math.round(city.cost_index)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

'use client';

import Link from 'next/link';
import { City } from '@/types/database';
import { useCurrency } from '@/context/CurrencyContext';
import { getCityImage } from '@/lib/cityImages';
import { useState, useEffect } from 'react';

interface CityCardProps {
    city: City;
    preloadedImage?: string;
}

function useCityImage(slug: string, cityName: string, countryName: string) {
    const staticImg = getCityImage(slug, 800, 600, cityName);
    const hasStatic = !staticImg.includes('picsum') && !staticImg.includes('source.unsplash');

    const [imgUrl, setImgUrl] = useState(hasStatic ? staticImg : '');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (hasStatic) { setLoaded(true); return; }

        // Fetch from Wikimedia
        const query = encodeURIComponent(cityName.replace(/ /g, '_'));
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
            .then(r => r.json())
            .then(data => {
                const url = data?.thumbnail?.source || data?.originalimage?.source;
                if (url && !url.match(/flag|Flag|map|Map|coat|Coat|logo/i)) {
                    setImgUrl(url.replace(/\/\d+px-/, '/800px-'));
                } else {
                    // Try city + country
                    return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent((cityName + ',_' + countryName).replace(/ /g, '_'))}`)
                        .then(r => r.json())
                        .then(d => {
                            const u = d?.thumbnail?.source;
                            if (u && !u.match(/flag|Flag|map|Map|coat|Coat/i)) {
                                setImgUrl(u.replace(/\/\d+px-/, '/800px-'));
                            } else {
                                // picsum fallback
                                const seed = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000;
                                setImgUrl(`https://picsum.photos/seed/${seed}/800/600`);
                            }
                        });
                }
            })
            .catch(() => {
                const seed = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000;
                setImgUrl(`https://picsum.photos/seed/${seed}/800/600`);
            })
            .finally(() => setLoaded(true));
    }, [slug, cityName, countryName, hasStatic, staticImg]);

    return imgUrl || staticImg;
}

export default function CityCard({ city, preloadedImage }: CityCardProps) {
    const { formatValue } = useCurrency();
    const estimatedMonthly = (city.rent_index ?? 0) + ((city.food_index ?? 0) * 30) + (city.transport_index ?? 0) + (city.utilities_index ?? 0);
    const hasData = estimatedMonthly > 0;
    const clientImage = useCityImage(city.slug, city.city, city.country);
    const dynamicImage = preloadedImage || clientImage;

    const safetyColor = (city.safety ?? 0) >= 7 ? '#40916C' : (city.safety ?? 0) >= 5 ? '#d97706' : '#dc2626';
    const internetLabel = (city.internet ?? 0) >= 50 ? 'Fast' : (city.internet ?? 0) >= 20 ? 'Good' : (city.internet ?? 0) > 0 ? 'Slow' : null;

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '1px solid #e2e8f0', boxShadow: 'none', background: '#ffffff',
            borderRadius: 'var(--radius-md)', textDecoration: 'none'
        }}>
            <div style={{
                height: '200px',
                backgroundColor: '#f1f5f9',
                backgroundImage: dynamicImage ? `url(${dynamicImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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

            <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'break-word' }}>{city.city}</h3>
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

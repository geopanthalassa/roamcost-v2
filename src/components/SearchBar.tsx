'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    preloadedCity?: string; // slug de ciudad pre-cargada para comparar
}

export default function SearchBar({ preloadedCity }: SearchBarProps = {}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const searchCities = async () => {
            if (query.length < 2) { setResults([]); return; }
            setLoading(true);
            const { data } = await supabase
                .from('cities_master')
                .select('*')
                .ilike('city', `%${query}%`)
                .limit(6);
            if (data) setResults(data);
            setLoading(false);
        };
        const t = setTimeout(searchCities, 300);
        return () => clearTimeout(t);
    }, [query]);

    const handleCompare = (citySlug: string) => {
        if (preloadedCity) {
            router.push(`/compare/${preloadedCity}-vs-${citySlug}`);
        } else {
            router.push(`/compare?city1=${citySlug}`);
        }
        setQuery('');
        setResults([]);
    };

    return (
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Find a city (e.g. Paris, Tokyo, Zurich...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '1.25rem 1.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #e2e8f0',
                        fontSize: '1.1rem',
                        outline: 'none',
                        color: '#0f172a',
                        transition: 'border-color 0.2s',
                    }}
                />
                <button
                    onClick={() => {
                        if (results.length > 0) handleCompare(results[0].slug);
                        else if (preloadedCity) router.push(`/compare?city1=${preloadedCity}`);
                        else router.push('/compare');
                    }}
                    style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: '#52B788',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.6rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(82,183,136,0.35)',
                        transition: 'transform 0.15s',
                    }}
                    title="Compare cities"
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    +
                </button>
            </div>

            {results.length > 0 && (
                <div className="search-results card" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    zIndex: 99999,
                    padding: '0.5rem',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                    borderRadius: '0.875rem',
                    backgroundColor: 'white',
                }}>
                    {results.map((city) => (
                        <div
                            key={city.slug}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                gap: '0.5rem',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Link
                                href={`/city/${city.slug}`}
                                style={{ flex: 1, textDecoration: 'none' }}
                                onClick={() => { setQuery(''); setResults([]); }}
                            >
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>{city.city}</span>
                                <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{city.country}</span>
                            </Link>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                                {city.cost_index > 0 && (
                                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        Score {city.cost_index}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleCompare(city.slug)}
                                    style={{
                                        backgroundColor: '#52B788',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.4rem',
                                        padding: '0.3rem 0.6rem',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    + Compare
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



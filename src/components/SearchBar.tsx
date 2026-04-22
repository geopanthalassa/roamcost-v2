'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchCities = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('cities_master')
                .select('*')
                .ilike('city', `%${query}%`)
                .limit(5);

            if (data) setResults(data);
            setLoading(false);
        };

        const timeoutId = setTimeout(searchCities, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <input
                type="text"
                placeholder="Find a city (e.g. Paris, Tokyo, Zurich...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1.5rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0',
                    fontSize: '1.25rem',
                    boxShadow: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    color: '#0f172a'
                }}
            />

            {results.length > 0 && (
                <div className="search-results card" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: '0.75rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {results.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/city/${city.slug}`}
                            className="search-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 1.25rem',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div>
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>{city.city}</span>
                                <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{city.country}</span>
                            </div>
                            <div style={{ color: '#52B788', fontWeight: 900, fontSize: '0.9rem' }}>
                                Value Index: {city.cost_index}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

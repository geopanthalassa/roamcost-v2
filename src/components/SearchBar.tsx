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
                placeholder="Search for a city (e.g. Paris, Tokyo, Medellin...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1.25rem 2rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                    fontSize: '1.125rem',
                    boxShadow: 'var(--shadow-lg)',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                }}
            />

            {results.length > 0 && (
                <div className="search-results card" style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: '0.5rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    {results.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/city/${city.slug}`}
                            className="search-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div>
                                <span style={{ fontWeight: 600 }}>{city.city}</span>
                                <span style={{ color: 'var(--muted)', marginLeft: '0.5rem' }}>{city.country}</span>
                            </div>
                            <div style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                Score: {city.cost_index}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

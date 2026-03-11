'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompareLandingPage() {
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('');
    const [results1, setResults1] = useState<City[]>([]);
    const [results2, setResults2] = useState<City[]>([]);
    const [city1, setCity1] = useState<City | null>(null);
    const [city2, setCity2] = useState<City | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (search1.length > 2) {
            handleSearch(search1, setResults1);
        } else {
            setResults1([]);
        }
    }, [search1]);

    useEffect(() => {
        if (search2.length > 2) {
            handleSearch(search2, setResults2);
        } else {
            setResults2([]);
        }
    }, [search2]);

    const handleSearch = async (query: string, setter: (cities: City[]) => void) => {
        const { data } = await supabase
            .from('cities_master')
            .select('*')
            .ilike('city', `%${query}%`)
            .limit(5);
        setter((data as City[]) || []);
    };

    const handleCompare = () => {
        if (city1 && city2) {
            router.push(`/compare/${city1.slug}-vs-${city2.slug}`);
        }
    };

    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)' }}>Compare <span style={{ color: 'var(--secondary)' }}>Cities</span></h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>Select any two cities to see a detailed side-by-side comparison of costs and lifestyle.</p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                {/* City 1 Selection */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--foreground)' }}>First City</label>
                    {city1 ? (
                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--primary)' }}>
                            <span style={{ fontWeight: 700 }}>{city1.city}, {city1.country}</span>
                            <button onClick={() => setCity1(null)} style={{ color: 'var(--danger)', fontWeight: 800 }}>✕</button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={search1}
                                onChange={(e) => setSearch1(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                            {results1.length > 0 && (
                                <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', padding: '0.5rem' }}>
                                    {results1.map(city => (
                                        <button
                                            key={city.slug}
                                            onClick={() => { setCity1(city); setResults1([]); setSearch1(''); }}
                                            style={{ width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '4px', borderBottom: '1px solid var(--border)', display: 'block' }}
                                        >
                                            <span style={{ fontWeight: 700 }}>{city.city}</span>, {city.country}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* City 2 Selection */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--foreground)' }}>Second City</label>
                    {city2 ? (
                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--primary)' }}>
                            <span style={{ fontWeight: 700 }}>{city2.city}, {city2.country}</span>
                            <button onClick={() => setCity2(null)} style={{ color: 'var(--danger)', fontWeight: 800 }}>✕</button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={search2}
                                onChange={(e) => setSearch2(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    fontSize: '1rem',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                            {results2.length > 0 && (
                                <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', padding: '0.5rem' }}>
                                    {results2.map(city => (
                                        <button
                                            key={city.slug}
                                            onClick={() => { setCity2(city); setResults2([]); setSearch2(''); }}
                                            style={{ width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '4px', borderBottom: '1px solid var(--border)', display: 'block' }}
                                        >
                                            <span style={{ fontWeight: 700 }}>{city.city}</span>, {city.country}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <button
                    onClick={handleCompare}
                    disabled={!city1 || !city2}
                    className="btn btn-primary"
                    style={{
                        padding: '1.25rem 3rem',
                        fontSize: '1.25rem',
                        borderRadius: 'var(--radius-xl)',
                        opacity: (!city1 || !city2) ? 0.5 : 1,
                        cursor: (!city1 || !city2) ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
                    }}
                >
                    Start Comparison
                </button>
            </div>
        </div>
    );
}

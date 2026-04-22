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
            .not('population', 'is', null)
            .order('population', { ascending: false })
            .limit(5);
        setter((data as City[]) || []);
    };

    const handleCompare = () => {
        if (city1 && city2) {
            router.push(`/compare/${city1.slug}-vs-${city2.slug}`);
        }
    };

    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '900px' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <span style={{ color: '#2BC0B4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Side-by-Side Analysis</span>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.06em', marginTop: '0.5rem' }}>
                    Compare <span style={{ color: '#2BC0B4' }}>global living</span> costs
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '1rem auto 0', fontWeight: 500 }}>
                    Select any two major cities to compare rent, food, transport, and overall standards.
                </p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                {/* City 1 Selection */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Origin Hub</label>
                    {city1 ? (
                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: '#2BC0B4', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{city1.city}, {city1.country}</span>
                            <button onClick={() => setCity1(null)} style={{ color: '#ef4444', fontWeight: 900 }}>✕</button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Search city (e.g. London)"
                                value={search1}
                                onChange={(e) => setSearch1(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1.1rem',
                                    outline: 'none',
                                    color: '#0f172a'
                                }}
                            />
                            {results1.length > 0 && (
                                <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                                    {results1.map(city => (
                                        <button
                                            key={city.slug}
                                            onClick={() => { setCity1(city); setResults1([]); setSearch1(''); }}
                                            style={{ width: '100%', textAlign: 'left', padding: '1rem', borderRadius: '4px', borderBottom: '1px solid #f1f5f9', display: 'block', backgroundColor: 'transparent', cursor: 'pointer' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{city.city}</span>, <span style={{ color: '#64748b' }}>{city.country}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* City 2 Selection */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination Hub</label>
                    {city2 ? (
                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: '#2BC0B4', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{city2.city}, {city2.country}</span>
                            <button onClick={() => setCity2(null)} style={{ color: '#ef4444', fontWeight: 900 }}>✕</button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Search city (e.g. Tokyo)"
                                value={search2}
                                onChange={(e) => setSearch2(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1.1rem',
                                    outline: 'none',
                                    color: '#0f172a'
                                }}
                            />
                            {results2.length > 0 && (
                                <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                                    {results2.map(city => (
                                        <button
                                            key={city.slug}
                                            onClick={() => { setCity2(city); setResults2([]); setSearch2(''); }}
                                            style={{ width: '100%', textAlign: 'left', padding: '1rem', borderRadius: '4px', borderBottom: '1px solid #f1f5f9', display: 'block', backgroundColor: 'transparent', cursor: 'pointer' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{city.city}</span>, <span style={{ color: '#64748b' }}>{city.country}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                <button
                    onClick={handleCompare}
                    disabled={!city1 || !city2}
                    className="btn"
                    style={{
                        padding: '1.5rem 4rem',
                        fontSize: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: (!city1 || !city2) ? '#e2e8f0' : '#7ee8e2',
                        color: 'white',
                        fontWeight: 900,
                        opacity: (!city1 || !city2) ? 0.7 : 1,
                        cursor: (!city1 || !city2) ? 'not-allowed' : 'pointer',
                        boxShadow: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    Initialize Comparison
                </button>
            </div>
        </div>
    );
}

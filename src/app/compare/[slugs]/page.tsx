'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const GREEN = '#52B788';
const ORANGE = '#F7831E';

interface City {
    slug: string; city: string; country: string;
    rent_index: number; food_index: number; transport_index: number;
    utilities_index: number; safety: number; internet: number;
    healthcare: number; cost_index: number; population: number;
}

const METRICS = [
    { label: 'Monthly Rent', key: 'rent_index', better: 'lower', format: 'money', desc: '1BR apartment' },
    { label: 'Food / month', key: 'food_index', better: 'lower', format: 'money', factor: 30, desc: 'Daily × 30 days' },
    { label: 'Transport', key: 'transport_index', better: 'lower', format: 'money', desc: 'Monthly pass' },
    { label: 'Utilities', key: 'utilities_index', better: 'lower', format: 'money', desc: 'Electricity + water' },
    { label: 'Safety', key: 'safety', better: 'higher', format: 'score', desc: 'Score out of 10' },
    { label: 'Internet', key: 'internet', better: 'higher', format: 'mbps', desc: 'Avg speed' },
    { label: 'Healthcare', key: 'healthcare', better: 'higher', format: 'score', desc: 'Score out of 10' },
];

function fmt(val: number | null, format: string) {
    if (!val) return '—';
    if (format === 'money') return `$${Math.round(val).toLocaleString()}`;
    if (format === 'mbps') return `${Math.round(val)} Mbps`;
    return val.toFixed(1);
}

function CityImage({ slug, city, country }: { slug: string; city: string; country: string }) {
    const POOL = [
        'photo-1477959858617-67f85cf4f1df','photo-1502602898657-3e91760cbb34',
        'photo-1513635269975-59663e0ac1ad','photo-1512470876302-972faa2aa9a4',
        'photo-1540959733332-eab4deabeeaf','photo-1508009603885-50cf7c579365',
        'photo-1512453979798-5ea266f8880c','photo-1506973035872-a4ec16b8e8d9',
        'photo-1585208798174-6cedd4454069','photo-1589909202802-8f4aadce9d55',
        'photo-1496442226666-8d4d0e62e6e9','photo-1534190760961-74e8c1c5c3da',
    ];
    const h = slug.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
    const fallback = `https://images.unsplash.com/${POOL[Math.abs(h) % POOL.length]}?auto=format&fit=crop&w=800&h=500&q=80`;
    const local = `/cities/${slug}.jpg`;
    return (
        <img
            src={local}
            alt={city}
            onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );
}

export default function CompareResultPage() {
    const params = useParams();
    const slugs = params.slugs as string;
    const citySlugList = slugs.split('-vs-').filter(Boolean).slice(0, 4);

    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/cities?slugs=${citySlugList.join(',')}`);
                const json = await res.json();
                console.log('Compare API response:', JSON.stringify(json).slice(0, 200));
                const data = Array.isArray(json) ? json : (json.data || []);
                if (!data || data.length < 1) {
                    setError(`Couldn't find: ${citySlugList.join(', ')}`);
                } else {
                    const ordered = citySlugList
                        .map((s: string) => data.find((c: City) => c.slug === s))
                        .filter(Boolean) as City[];
                    setCities(ordered.length >= 1 ? ordered : data);
                }
            } catch (e) {
                setError('Failed to load city data. Please try again.');
            }
            setLoading(false);
        }
        load();
    }, [slugs]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', border: `3px solid ${GREEN}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#64748b', fontWeight: 600 }}>Loading comparison...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error || cities.length === 0) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: '480px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Cities not found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.9rem' }}>{error || 'No data found for these cities.'}</p>
                <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                    Try another comparison →
                </Link>
            </div>
        </div>
    );

    const getVal = (city: City, key: string, factor = 1) => {
        const v = (city as any)[key];
        return v ? v * factor : null;
    };
    const getBest = (key: string, better: string, factor = 1) => {
        const vals = cities.map(c => getVal(c, key, factor)).filter(v => v != null) as number[];
        if (!vals.length) return null;
        return better === 'lower' ? Math.min(...vals) : Math.max(...vals);
    };
    const totalCost = (c: City) =>
        Math.round((c.rent_index || 0) + (c.food_index || 0) * 30 + (c.transport_index || 0) + (c.utilities_index || 0));

    const totals = cities.map(totalCost);
    const minTotal = Math.min(...totals.filter(t => t > 0));
    const n = cities.length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2.5rem 0 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <nav style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</Link>
                        <span>→</span>
                        <Link href="/compare" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Compare</Link>
                        <span>→</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{cities.map(c => c.city).join(' vs ')}</span>
                    </nav>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', margin: '0 0 0.4rem', letterSpacing: '-0.03em' }}>
                                {cities.map(c => c.city).join(' vs ')}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.85rem' }}>Cost of living comparison 2026</p>
                        </div>
                        {n < 4 && (
                            <Link href="/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.625rem', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>
                                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900 }}>+</span>
                                Add city
                            </Link>
                        )}
                    </div>

                    {/* City cards row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '1px', backgroundColor: '#334155' }}>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <CityImage slug={city.slug} city={city.city} country={city.country} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{city.country}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>{city.city}</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: totals[i] === minTotal && totals[i] > 0 ? GREEN : 'white', letterSpacing: '-0.02em' }}>
                                            {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/mo</span>
                                    </div>
                                    {totals[i] === minTotal && totals[i] > 0 && (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#52B78830', border: `1px solid ${GREEN}50`, borderRadius: '2rem', padding: '0.15rem 0.6rem', marginTop: '0.4rem' }}>
                                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: GREEN }} />
                                            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cheapest</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Comparison table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${n}, 1fr)`, backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <div style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
                        {cities.map(city => (
                            <div key={city.slug} style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                                <Link href={`/city/${city.slug}`} style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', textDecoration: 'none' }}>{city.city}</Link>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{city.country}</div>
                            </div>
                        ))}
                    </div>

                    {/* Metric rows */}
                    {METRICS.map((metric, mi) => {
                        const factor = (metric as any).factor || 1;
                        const best = getBest(metric.key, metric.better, factor);
                        const vals = cities.map(c => getVal(c, metric.key, factor));
                        return (
                            <div key={metric.key} style={{ display: 'grid', gridTemplateColumns: `160px repeat(${n}, 1fr)`, borderBottom: mi < METRICS.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: mi % 2 === 0 ? 'white' : '#fafbfc' }}>
                                <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{metric.label}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{metric.desc}</div>
                                </div>
                                {vals.map((val, i) => {
                                    const isBest = val != null && val === best;
                                    return (
                                        <div key={i} style={{ padding: '0.875rem 1rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0', backgroundColor: isBest ? '#F0FAF4' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: isBest ? 900 : 600, color: isBest ? GREEN : '#0f172a' }}>
                                                {fmt(val, metric.format)}
                                            </span>
                                            {isBest && val != null && (
                                                <span style={{ fontSize: '0.55rem', backgroundColor: GREEN, color: 'white', padding: '0.1rem 0.4rem', borderRadius: '2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    {metric.better === 'lower' ? 'Best price' : 'Best score'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Total row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${n}, 1fr)`, backgroundColor: '#0f172a' }}>
                        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white' }}>Monthly Total</span>
                        </div>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ padding: '1.25rem', textAlign: 'center', borderLeft: '1px solid #1e293b' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: totals[i] === minTotal && totals[i] > 0 ? GREEN : 'white' }}>
                                    {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                </div>
                                {totals[i] > 0 && totals[i] !== minTotal && minTotal > 0 && (
                                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
                                        +${(totals[i] - minTotal).toLocaleString()}/mo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* City profile cards */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '1rem', marginBottom: '1.5rem' }}>
                    {cities.map(city => (
                        <Link key={city.slug} href={`/city/${city.slug}`}
                            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.15s' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{city.city}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>Full city profile</div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Compare other cities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem', fontSize: '0.875rem' }}>Add up to 4 cities and see the full breakdown</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                            New comparison →
                        </Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                            Cheapest cities →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

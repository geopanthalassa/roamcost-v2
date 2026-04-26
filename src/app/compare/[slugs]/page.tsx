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
    { label: 'Monthly Rent', key: 'rent_index', better: 'lower', format: 'money', factor: 1, desc: '1BR apartment, city center' },
    { label: 'Food (monthly)', key: 'food_index', better: 'lower', format: 'money', factor: 30, desc: 'Daily cost × 30 days' },
    { label: 'Transport', key: 'transport_index', better: 'lower', format: 'money', factor: 1, desc: 'Monthly public pass' },
    { label: 'Utilities', key: 'utilities_index', better: 'lower', format: 'money', factor: 1, desc: 'Electricity + water + internet' },
    { label: 'Safety', key: 'safety', better: 'higher', format: 'score', factor: 1, desc: 'Safety index out of 10' },
    { label: 'Internet Speed', key: 'internet', better: 'higher', format: 'mbps', factor: 1, desc: 'Average Mbps' },
    { label: 'Healthcare', key: 'healthcare', better: 'higher', format: 'score', factor: 1, desc: 'Healthcare index out of 10' },
    { label: 'Quality of Life', key: 'cost_index', better: 'higher', format: 'score', factor: 1, desc: 'Overall quality score' },
];

const CITY_IMAGES: Record<string, string> = {
    'bangkok': 'photo-1508009603885-50cf7c579365',
    'lisbon': 'photo-1585208798174-6cedd4454069',
    'barcelona': 'photo-1583422409516-2895a77efded',
    'berlin': 'photo-1560969184-10fe8719e047',
    'tokyo': 'photo-1540959733332-eab4deabeeaf',
    'seoul': 'photo-1601621915196-2621bfb0cd6e',
    'dubai': 'photo-1512453979798-5ea266f8880c',
    'singapore': 'photo-1525625293386-3f8f99389edd',
    'new-york': 'photo-1496442226666-8d4d0e62e6e9',
    'mexico-city': 'photo-1585464231875-d9ef1f5ad396',
    'buenos-aires': 'photo-1589909202802-8f4aadce9d55',
    'lima': 'photo-1619946794135-5bc917a27793',
    'amsterdam': 'photo-1512470876302-972faa2aa9a4',
    'prague': 'photo-1541849546-216549ae216d',
    'london': 'photo-1513635269975-59663e0ac1ad',
    'paris': 'photo-1502602898657-3e91760cbb34',
    'rome': 'photo-1531572753322-ad063cecc140',
    'madrid': 'photo-1539037116277-4db20889f2d4',
    'vienna': 'photo-1516550135131-fe3dcdd41517',
    'budapest': 'photo-1565538420870-da08ff96a207',
    'sydney': 'photo-1506973035872-a4ec16b8e8d9',
    'melbourne': 'photo-1514395462421-22b2f9f6b81c',
};

// Local city photos map (uses uploaded photos first)
const LOCAL_PHOTOS: Record<string, string> = {
    'lisbon': '/cities/lisbon.jpg',
    'buenos-aires': '/cities/buenos-aires.jpg',
    'marseille': '/cities/marseille.jpg',
    'barcelona': '/cities/barcelona.jpg',
    'beijing': '/cities/beijing.jpg',
    'milan': '/cities/milan.jpg',
    'munich': '/cities/munich.jpg',
    'montreal': '/cities/montreal.jpg',
    'vancouver': '/cities/vancouver.jpg',
    'naples': '/cities/naples.jpg',
    'rotterdam': '/cities/rotterdam.jpg',
    'tbilisi': '/cities/tbilisi.jpg',
    'yokohama': '/cities/yokohama.jpg',
    'shenzhen': '/cities/shenzhen.jpg',
    'guadalajara': '/cities/guadalajara.jpg',
    'monterrey': '/cities/monterrey.jpg',
    'lima': '/cities/lima.jpg',
    'jakarta': '/cities/jakarta.jpg',
    'guangzhou': '/cities/guangzhou.jpg',
};

function getImg(slug: string, w = 800, h = 500) {
    // Use local photo if available
    if (LOCAL_PHOTOS[slug]) return LOCAL_PHOTOS[slug];
    const id = CITY_IMAGES[slug] || 'photo-1477959858617-67f85cf4f1df';
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

function fmt(val: number | null, format: string, factor = 1): string {
    if (!val) return '—';
    const v = val * factor;
    if (format === 'money') return `$${Math.round(v).toLocaleString()}`;
    if (format === 'mbps') return `${Math.round(v)} Mbps`;
    return v.toFixed(1);
}

export default function CompareResultPage() {
    const params = useParams();
    const slugs = params.slugs as string;
    const citySlugList = slugs.split('-vs-').filter(Boolean).slice(0, 4);

    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState<string[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/cities?slugs=${citySlugList.join(',')}`);
                const data = await res.json();
                const arr = Array.isArray(data) ? data : [];
                const ordered = citySlugList
                    .map(s => arr.find((c: City) => c.slug === s))
                    .filter(Boolean) as City[];
                const missing = citySlugList.filter(s => !arr.find((c: City) => c.slug === s));
                setNotFound(missing);
                setCities(ordered);
            } catch {
                setNotFound(citySlugList);
            }
            setLoading(false);
        }
        load();
    }, [slugs]);

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', border: `3px solid ${GREEN}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Loading comparison...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (cities.length === 0) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '4rem 3rem', textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: '480px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Cities not found</h2>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.9rem' }}>
                    We couldn't find <strong>{notFound.join(', ')}</strong> in our database.<br/>
                    Try searching from the compare page.
                </p>
                <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontSize: '0.9rem' }}>
                    Try another comparison →
                </Link>
            </div>
        </div>
    );

    const getVal = (city: City, key: string) => (city as any)[key] as number | null;
    const getBest = (key: string, better: string, factor = 1) => {
        const vals = cities.map(c => { const v = getVal(c, key); return v ? v * factor : null; }).filter(v => v != null) as number[];
        if (!vals.length) return null;
        return better === 'lower' ? Math.min(...vals) : Math.max(...vals);
    };
    const totalCost = (c: City) => Math.round((c.rent_index || 0) + (c.food_index || 0) * 30 + (c.transport_index || 0) + (c.utilities_index || 0));
    const totals = cities.map(totalCost);
    const minTotal = Math.min(...totals.filter(t => t > 0));
    const cols = cities.length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Hero header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2.5rem 0 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>→</span>
                        <Link href="/compare" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Compare</Link>
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>→</span>
                        <span style={{ color: 'rgba(255,255,255,0.65)' }}>{cities.map(c => c.city).join(' vs ')}</span>
                    </div>

                    <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', margin: '0 0 0.35rem', letterSpacing: '-0.03em' }}>
                        {cities.map(c => c.city).join(' vs ')}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 2rem', fontSize: '0.82rem' }}>
                        Cost of living comparison 2026 · Updated monthly
                    </p>

                    {/* City photo cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px' }}>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <img src={getImg(city.slug)} alt={city.city}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem' }}>
                                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{city.country}</div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'white', marginBottom: '0.3rem' }}>{city.city}</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: totals[i] === minTotal ? GREEN : 'white' }}>
                                            {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>/mo</span>
                                    </div>
                                    {totals[i] === minTotal && totals[i] > 0 && (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(82,183,136,0.25)', border: '1px solid rgba(82,183,136,0.5)', borderRadius: '2rem', padding: '0.15rem 0.5rem', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.58rem', fontWeight: 900, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Cheapest</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Not found warning */}
                {notFound.length > 0 && (
                    <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#92400e' }}>
                        ⚠️ Not found in our database: <strong>{notFound.join(', ')}</strong>. Showing available cities.
                    </div>
                )}

                {/* Add city button */}
                {cities.length < 4 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <Link href="/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', padding: '0.45rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textDecoration: 'none' }}>
                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: GREEN, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, flexShrink: 0 }}>+</span>
                            Add city
                        </Link>
                    </div>
                )}

                {/* Comparison table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: `190px repeat(${cols}, 1fr)`, backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <div style={{ padding: '0.875rem 1.25rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
                        {cities.map(city => (
                            <div key={city.slug} style={{ padding: '0.875rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                                <Link href={`/city/${city.slug}`} style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', textDecoration: 'none' }}>{city.city}</Link>
                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '0.1rem' }}>{city.country}</div>
                            </div>
                        ))}
                    </div>

                    {/* Metric rows */}
                    {METRICS.map((m, mi) => {
                        const best = getBest(m.key, m.better, m.factor);
                        const vals = cities.map(c => { const v = getVal(c, m.key); return v ? v * m.factor : null; });
                        return (
                            <div key={m.key} style={{ display: 'grid', gridTemplateColumns: `190px repeat(${cols}, 1fr)`, borderBottom: mi < METRICS.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: mi % 2 === 0 ? 'white' : '#fafbfc' }}>
                                <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{m.label}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{m.desc}</div>
                                </div>
                                {vals.map((val, i) => {
                                    const isBest = val != null && val === best;
                                    return (
                                        <div key={i} style={{ padding: '0.875rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0', backgroundColor: isBest ? '#F0FAF4' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: isBest ? 900 : 600, color: isBest ? GREEN : '#334155' }}>
                                                {fmt(getVal(cities[i], m.key), m.format, m.factor)}
                                            </span>
                                            {isBest && val != null && (
                                                <span style={{ fontSize: '0.55rem', backgroundColor: GREEN, color: 'white', padding: '0.1rem 0.4rem', borderRadius: '2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    {m.better === 'lower' ? 'Cheapest' : 'Best'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Total row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `190px repeat(${cols}, 1fr)`, backgroundColor: '#0f172a' }}>
                        <div style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Est. Monthly Total</span>
                        </div>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ padding: '1.1rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #1e293b' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: totals[i] === minTotal ? GREEN : 'white' }}>
                                    {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                </div>
                                {totals[i] > 0 && totals[i] !== minTotal && minTotal > 0 && (
                                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>
                                        +${(totals[i] - minTotal).toLocaleString()}/mo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* City cards */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem', marginBottom: '1.5rem' }}>
                    {cities.map(city => (
                        <Link key={city.slug} href={`/city/${city.slug}`}
                            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.1rem 1.25rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.15s' }}>
                            <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{city.city} full profile</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>Cost personalizer, restaurants, things to do →</div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Compare other cities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem', fontSize: '0.85rem' }}>Add up to 4 cities and compare side by side</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>New comparison →</Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>Cheapest cities →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

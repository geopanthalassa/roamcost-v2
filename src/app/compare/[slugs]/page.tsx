'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const GREEN = '#52B788';

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
    { label: 'Safety', key: 'safety', better: 'higher', format: 'score', factor: 1, desc: 'Safety index / 10' },
    { label: 'Internet Speed', key: 'internet', better: 'higher', format: 'mbps', factor: 1, desc: 'Average Mbps' },
    { label: 'Healthcare', key: 'healthcare', better: 'higher', format: 'score', factor: 1, desc: 'Healthcare index / 10' },
    { label: 'Quality of Life', key: 'cost_index', better: 'higher', format: 'score', factor: 1, desc: 'Overall quality score' },
];

// Fallback Unsplash pool — deterministic by city slug
const POOL = [
    'photo-1477959858617-67f85cf4f1df','photo-1502602898657-3e91760cbb34',
    'photo-1513635269975-59663e0ac1ad','photo-1512470876302-972faa2aa9a4',
    'photo-1540959733332-eab4deabeeaf','photo-1508009603885-50cf7c579365',
    'photo-1512453979798-5ea266f8880c','photo-1506973035872-a4ec16b8e8d9',
    'photo-1585208798174-6cedd4454069','photo-1589909202802-8f4aadce9d55',
    'photo-1496442226666-8d4d0e62e6e9','photo-1534190760961-74e8c1c5c3da',
    'photo-1560969184-10fe8719e047','photo-1524231757912-21f4fe3a7200',
    'photo-1541849546-216549ae216d','photo-1525625293386-3f8f99389edd',
];

function poolImg(slug: string) {
    const h = Math.abs(slug.split('').reduce((a,c) => ((a<<5)-a)+c.charCodeAt(0), 0));
    return `https://images.unsplash.com/${POOL[h % POOL.length]}?auto=format&fit=crop&w=800&h=500&q=80`;
}

function CityCard({ city, total, isWinner }: { city: City; total: number; isWinner: boolean }) {
    // Try local file first, fallback to pool
    const localSrc = `/cities/${city.slug}.jpg`;
    const fallback = poolImg(city.slug);
    const [src, setSrc] = useState(localSrc);

    return (
        <Link href={`/city/${city.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden',
                border: isWinner ? `2px solid ${GREEN}` : '1px solid #e2e8f0',
                boxShadow: isWinner ? `0 4px 20px ${GREEN}22` : '0 1px 4px rgba(0,0,0,0.06)',
            }}>
                {/* Photo */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img src={src} alt={city.city}
                        onError={() => setSrc(fallback)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                    {isWinner && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: GREEN, color: 'white', fontSize: '0.58rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            ✓ Cheapest
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{city.country}</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'white' }}>{city.city}</div>
                    </div>
                </div>
                {/* Cost + link */}
                <div style={{ padding: '0.875rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.1rem' }}>Est. monthly cost</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isWinner ? GREEN : '#0f172a' }}>
                            {total > 0 ? `$${total.toLocaleString()}` : '—'}
                        </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
            </div>
        </Link>
    );
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

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/cities?slugs=${citySlugList.join(',')}`);
                const data = await res.json();
                setCities(Array.isArray(data) ? data : []);
            } catch {
                setCities([]);
            }
            setLoading(false);
        }
        load();
    }, [slugs]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', border: `3px solid ${GREEN}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Loading comparison...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (cities.length === 0) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: '480px' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Cities not found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.88rem' }}>
                    We couldn't find <strong>{citySlugList.join(', ')}</strong> in our database.<br/>
                    Try searching from the compare page.
                </p>
                <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
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
    const totalCost = (c: City) => Math.round((c.rent_index||0) + (c.food_index||0)*30 + (c.transport_index||0) + (c.utilities_index||0));
    const totals = cities.map(totalCost);
    const minTotal = Math.min(...totals.filter(t => t > 0));
    const cols = cities.length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

            {/* ── HEADER — city names prominent at top ── */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '3rem 0 2.5rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.72rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                        <Link href="/compare" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Compare</Link>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{cities.map(c => c.city).join(' vs ')}</span>
                    </div>

                    {/* City names — big, clear */}
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', margin: '0 0 0.4rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        {cities.map((c, i) => (
                            <span key={c.slug}>
                                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1.4rem', margin: '0 0.6rem' }}>vs</span>}
                                {c.city}
                            </span>
                        ))}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: 0 }}>
                        Cost of living comparison 2026 · Updated monthly
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* Add city button */}
                {cities.length < 4 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                        <Link href="/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textDecoration: 'none' }}>
                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: GREEN, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900 }}>+</span>
                            Add city
                        </Link>
                    </div>
                )}

                {/* ── COMPARISON TABLE ── */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: `185px repeat(${cols}, 1fr)`, backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <div style={{ padding: '0.875rem 1.25rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
                        {cities.map(city => (
                            <div key={city.slug} style={{ padding: '0.875rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{city.city}</div>
                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '0.1rem' }}>{city.country}</div>
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {METRICS.map((m, mi) => {
                        const best = getBest(m.key, m.better, m.factor);
                        return (
                            <div key={m.key} style={{ display: 'grid', gridTemplateColumns: `185px repeat(${cols}, 1fr)`, borderBottom: mi < METRICS.length-1 ? '1px solid #f1f5f9' : 'none', backgroundColor: mi%2===0 ? 'white' : '#fafbfc' }}>
                                <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{m.label}</div>
                                    <div style={{ fontSize: '0.63rem', color: '#94a3b8', marginTop: '0.1rem' }}>{m.desc}</div>
                                </div>
                                {cities.map((city, i) => {
                                    const val = getVal(city, m.key);
                                    const display = val ? val * m.factor : null;
                                    const isBest = display != null && display === best;
                                    return (
                                        <div key={i} style={{ padding: '0.875rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0', backgroundColor: isBest ? '#F0FAF4' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: isBest ? 900 : 600, color: isBest ? GREEN : '#334155' }}>
                                                {fmt(val, m.format, m.factor)}
                                            </span>
                                            {isBest && display != null && (
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
                    <div style={{ display: 'grid', gridTemplateColumns: `185px repeat(${cols}, 1fr)`, backgroundColor: '#0f172a' }}>
                        <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>Est. Monthly Total</span>
                        </div>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ padding: '1rem 0.75rem', textAlign: 'center', borderLeft: '1px solid #1e293b' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: totals[i] === minTotal ? GREEN : 'white' }}>
                                    {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                </div>
                                {totals[i] > 0 && totals[i] !== minTotal && minTotal > 0 && (
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>
                                        +${(totals[i]-minTotal).toLocaleString()}/mo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── AFFILIATE CTAs — after seeing the data, user is ready to act ── */}
                {cities.length >= 2 && (
                    <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                            Ready to visit or move? — find the best deals
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {cities.slice(0, 2).map((city, i) => (
                                <a key={`hotel-${city.slug}`}
                                    href={`https://www.awin1.com/cread.php?awinmid=105929&awinaffid=2865959&ued=${encodeURIComponent('https://www.trivago.com/?aDateless=1&search/200-' + city.city)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', flexDirection: 'column', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.875rem', textDecoration: 'none', border: '1px solid #e2e8f0', gap: '0.25rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Hotels in {city.city}</span>
                                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Compare prices on Trivago</span>
                                </a>
                            ))}
                            <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(cities[0]?.city || '')}&searchSource=1&partner_id=VVPTRVK`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', flexDirection: 'column', padding: '1rem', backgroundColor: '#fff8f0', borderRadius: '0.875rem', textDecoration: 'none', border: '1px solid #F7831E22', gap: '0.25rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Tours & Activities</span>
                                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>via GetYourGuide</span>
                            </a>
                        </div>
                    </div>
                )}

                {/* ── CITY CARDS WITH PHOTOS — at the bottom ── */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem', marginBottom: '2rem' }}>
                    {cities.map((city, i) => (
                        <CityCard key={city.slug} city={city} total={totals[i]} isWinner={totals[i] === minTotal && totals[i] > 0} />
                    ))}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Compare other cities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem', fontSize: '0.85rem' }}>Add up to 4 cities and see side by side</p>
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

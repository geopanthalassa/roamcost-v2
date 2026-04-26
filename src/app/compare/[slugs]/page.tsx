// CLIENT COMPONENT — avoids server-side Supabase allowlist restriction
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const GREEN = '#52B788';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface City {
    slug: string; city: string; country: string;
    rent_index: number; food_index: number; transport_index: number;
    utilities_index: number; safety: number; internet: number;
    healthcare: number; cost_index: number; population: number;
}

const METRICS = [
    { label: 'Monthly Rent', key: 'rent_index', better: 'lower', format: 'money', desc: '1BR apartment' },
    { label: 'Food / month', key: 'food_index', better: 'lower', format: 'money', factor: 30, desc: 'Daily cost × 30' },
    { label: 'Transport', key: 'transport_index', better: 'lower', format: 'money', desc: 'Monthly pass' },
    { label: 'Utilities', key: 'utilities_index', better: 'lower', format: 'money', desc: 'Electricity + water' },
    { label: 'Safety', key: 'safety', better: 'higher', format: 'score', desc: 'Out of 10' },
    { label: 'Internet', key: 'internet', better: 'higher', format: 'mbps', desc: 'Avg speed' },
    { label: 'Healthcare', key: 'healthcare', better: 'higher', format: 'score', desc: 'Out of 10' },
    { label: 'Quality Score', key: 'cost_index', better: 'higher', format: 'score', desc: 'Overall' },
];

function fmt(val: number | null, format: string) {
    if (!val) return '—';
    if (format === 'money') return `$${Math.round(val).toLocaleString()}`;
    if (format === 'mbps') return `${Math.round(val)} Mbps`;
    return val.toFixed(1);
}

export default function ComparePage() {
    const params = useParams();
    const slugs = params.slugs as string;
    const citySlugList = slugs.split('-vs-').filter(Boolean).slice(0, 4);

    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const slugFilter = citySlugList.map(s => `"${s}"`).join(',');
                const res = await fetch(
                    `/api/cities?slugs=${citySlugList.join(',')}`
                );
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                if (!data || data.length < 1) { setError(true); }
                else {
                    const ordered = citySlugList
                        .map((s: string) => data.find((c: City) => c.slug === s))
                        .filter(Boolean) as City[];
                    setCities(ordered);
                }
            } catch { setError(true); }
            setLoading(false);
        }
        load();
    }, [slugs]);

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: `3px solid ${GREEN}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#64748b', fontWeight: 600 }}>Loading comparison...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error || cities.length < 2) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '4rem', textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: '500px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Cities not found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
                    We couldn't find data for: <strong>{citySlugList.join(', ')}</strong>.<br/>
                        These cities may not be in our database yet. Try other cities.
                </p>
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

    const totalCost = (city: City) => {
        return Math.round(
            (city.rent_index || 0) +
            ((city.food_index || 0) * 30) +
            (city.transport_index || 0) +
            (city.utilities_index || 0)
        );
    };

    const totals = cities.map(totalCost);
    const minTotal = Math.min(...totals.filter(t => t > 0));

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '3rem 0 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <nav style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</Link>
                        <span>→</span>
                        <Link href="/compare" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Compare</Link>
                        <span>→</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{cities.map(c => c.city).join(' vs ')}</span>
                    </nav>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                        {cities.map(c => c.city).join(' vs ')}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', margin: '0 0 2rem', fontSize: '0.875rem' }}>
                        Cost of living comparison 2026 · Updated monthly
                    </p>

                    {/* City header row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cities.length}, 1fr)`, gap: '1px', backgroundColor: '#334155' }}>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ backgroundColor: '#0f172a', padding: '1.5rem 1.25rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{city.country}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>{city.city}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: totals[i] === minTotal && totals[i] > 0 ? GREEN : 'white' }}>
                                    {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginLeft: '0.3rem', fontWeight: 600 }}>/mo</span>
                                </div>
                                {totals[i] === minTotal && totals[i] > 0 && (
                                    <div style={{ display: 'inline-block', backgroundColor: '#52B78820', border: '1px solid #52B78840', borderRadius: '2rem', padding: '0.15rem 0.6rem', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: GREEN, textTransform: 'uppercase' }}>Cheapest ✓</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Add city */}
                {cities.length < 4 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <Link href="/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.625rem', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textDecoration: 'none' }}>
                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: GREEN, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, flexShrink: 0 }}>+</span>
                            Add another city
                        </Link>
                    </div>
                )}

                {/* Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${cities.length}, 1fr)`, backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <div style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
                        {cities.map(city => (
                            <div key={city.slug} style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                                <Link href={`/city/${city.slug}`} style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', textDecoration: 'none' }}>{city.city}</Link>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>{city.country}</div>
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {METRICS.map((metric, mi) => {
                        const factor = (metric as any).factor || 1;
                        const best = getBest(metric.key, metric.better, factor);
                        const vals = cities.map(c => getVal(c, metric.key, factor));
                        return (
                            <div key={metric.key} style={{ display: 'grid', gridTemplateColumns: `180px repeat(${cities.length}, 1fr)`, borderBottom: mi < METRICS.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: mi % 2 === 0 ? 'white' : '#fafbfc' }}>
                                <div style={{ padding: '1rem 1.25rem' }}>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a' }}>{metric.label}</div>
                                    <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginTop: '0.1rem' }}>{metric.desc}</div>
                                </div>
                                {vals.map((val, i) => {
                                    const isBest = val != null && val === best;
                                    return (
                                        <div key={i} style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0', backgroundColor: isBest ? '#F0FAF4' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: isBest ? 900 : 600, color: isBest ? GREEN : '#0f172a' }}>
                                                {fmt(val, metric.format)}
                                            </span>
                                            {isBest && val != null && (
                                                <span style={{ fontSize: '0.55rem', backgroundColor: GREEN, color: 'white', padding: '0.1rem 0.4rem', borderRadius: '2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    {metric.better === 'lower' ? 'Cheapest' : 'Best'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Total */}
                    <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${cities.length}, 1fr)`, backgroundColor: '#0f172a' }}>
                        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>Monthly Total</span>
                        </div>
                        {cities.map((city, i) => (
                            <div key={city.slug} style={{ padding: '1.25rem', textAlign: 'center', borderLeft: '1px solid #1e293b' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: totals[i] === minTotal && totals[i] > 0 ? GREEN : 'white' }}>
                                    {totals[i] > 0 ? `$${totals[i].toLocaleString()}` : '—'}
                                </div>
                                {totals[i] > 0 && totals[i] !== minTotal && minTotal > 0 && (
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem' }}>
                                        +${(totals[i] - minTotal).toLocaleString()}/mo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* City links */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cities.length}, 1fr)`, gap: '1rem', marginBottom: '2rem' }}>
                    {cities.map(city => (
                        <Link key={city.slug} href={`/city/${city.slug}`}
                            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{city.city}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.1rem' }}>Full city profile →</div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Compare other cities</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem', fontSize: '0.875rem' }}>Add up to 4 cities side by side</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>New comparison →</Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>Cheapest cities →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ✅ SERVER COMPONENT — compare/[slugs]/page.tsx

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import { getCityImageServer } from '@/lib/getCityImageServer';

interface ComparePageProps {
    params: Promise<{ slugs: string }>;
}

export async function generateMetadata({ params }: ComparePageProps) {
    const { slugs } = await params;
    const [slug1, slug2] = (slugs || '').split('-vs-');
    const c1 = slug1?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const c2 = slug2?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const title = `${c1} vs ${c2} Cost of Living Comparison 2026 | RoamCost`;
    const description = `Compare cost of living between ${c1} and ${c2}. Rent, food, safety, internet and quality of life — side by side. Free data for expats and digital nomads.`;
    return {
        title,
        description,
        openGraph: { title, description, url: `https://www.roamcost.com/compare/${slugs}`, siteName: 'RoamCost', type: 'website' },
        twitter: { card: 'summary_large_image', title, description },
        alternates: { canonical: `https://www.roamcost.com/compare/${slugs}` },
        keywords: `${c1} vs ${c2}, cost of living comparison, ${c1} ${c2} rent prices, living in ${c1} vs ${c2}`,
    };
}

export const dynamic = 'force-dynamic';

export default async function ComparePage({ params }: ComparePageProps) {
    const { slugs } = await params;
    const [slug1, slug2] = (slugs || '').split('-vs-');
    if (!slug1 || !slug2) notFound();

    const { data } = await supabase
        .from('cities_master')
        .select('*')
        .in('slug', [slug1, slug2])
        .order('population', { ascending: false });

    const cities = (data as City[]) || [];
    // Pick the row with highest population for each slug (avoids small towns with same slug)
    const city1 = cities.find(c => c.slug === slug1);
    const city2 = cities.find(c => c.slug === slug2);

    if (!city1 || !city2) {
        return (
            <div className="container section">
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>Cities not found</h2>
                    <p style={{ color: '#64748b' }}>We couldn't find data for this comparison.</p>
                    <Link href="/compare" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                        Try Another Comparison
                    </Link>
                </div>
            </div>
        );
    }

    const est1 = Math.round((city1.rent_index) + (city1.food_index * 30) + (city1.transport_index) + (city1.utilities_index));
    const est2 = Math.round((city2.rent_index) + (city2.food_index * 30) + (city2.transport_index) + (city2.utilities_index));

    // Prefetch images server-side
    const [img1, img2] = await Promise.all([
        getCityImageServer(city1.slug, city1.city, city1.country, 600),
        getCityImageServer(city2.slug, city2.city, city2.country, 600),
    ]);

    const metrics = [
        { label: 'Quality Score', icon: 'chart', key: 'cost_index', higherBetter: true },
        { label: 'Monthly Rent', icon: 'home', key: 'rent_index', factor: 1, higherBetter: false, prefix: '$' },
        { label: 'Food & Dining', icon: 'food', key: 'food_index', factor: 30, higherBetter: false, prefix: '$' },
        { label: 'Transport', icon: 'bus', key: 'transport_index', factor: 1, higherBetter: false, prefix: '$' },
        { label: 'Utilities', icon: 'bolt', key: 'utilities_index', factor: 1, higherBetter: false, prefix: '$' },
        { label: 'Safety', icon: 'shield', key: 'safety', higherBetter: true },
        { label: 'Internet (Mbps)', icon: 'wifi', key: 'internet', higherBetter: true },
        { label: 'Healthcare', icon: 'health', key: 'healthcare', higherBetter: true },
        { label: 'Environment', icon: 'leaf', key: 'environment', higherBetter: true },
    ];

    const iconMap: Record<string, string> = {
        chart: 'M18 20v-10M12 20V4M6 20v-6',
        home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
        food: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z',
        bus: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8z',
        bolt: 'M13 2L3 14h9l-1 8 10-12h-9z',
        shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        wifi: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0',
        health: 'M22 12h-4l-3 9L9 3l-3 9H2',
        leaf: 'M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.38 1.37C7.14 19.14 10.5 18 13 18c5 0 9-4 9-9M17 8l-5 5',
    };

    return (
        <div className="container section animate-fade-in">

            {/* Breadcrumb */}
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <Link href="/" style={{ color: '#52B788', fontWeight: 600 }}>Home</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <Link href="/compare" style={{ color: '#52B788', fontWeight: 600 }}>Compare</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{city1.city} vs {city2.city}</span>
            </nav>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="compare-title" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
                    <span style={{ color: '#52B788' }}>{city1.city}</span>
                    <span style={{ color: '#94a3b8', fontSize: '2rem', margin: '0 1rem' }}>vs</span>
                    <span style={{ color: '#52B788' }}>{city2.city}</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    {city1.country} — {city2.country} · Cost of Living Comparison 2026
                </p>
            </div>

            {/* Monthly total comparison */}
            <div className="compare-totals" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', border: est1 < est2 ? '2px solid #52B788' : '1px solid #e2e8f0', boxShadow: 'none' }}>
                    {est1 < est2 && <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', marginBottom: '0.4rem' }}>✓ More Affordable</div>}
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city1.city}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0' }}>${est1.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>per month</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#94a3b8', textAlign: 'center' }}>vs</div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', border: est2 < est1 ? '2px solid #52B788' : '1px solid #e2e8f0', boxShadow: 'none' }}>
                    {est2 < est1 && <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', marginBottom: '0.4rem' }}>✓ More Affordable</div>}
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city2.city}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0' }}>${est2.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>per month</div>
                </div>
            </div>

            {/* Comparison — mobile cards, desktop table */}
            <div style={{ marginBottom: '3rem' }}>
                {/* Desktop table */}
                <div className="compare-table-desktop" style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700 }}>Metric</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 900 }}>{city1.city}</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 900 }}>{city2.city}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((metric, idx) => {
                                const raw1 = (city1 as any)[metric.key];
                                const raw2 = (city2 as any)[metric.key];
                                const val1 = raw1 * (metric.factor || 1);
                                const val2 = raw2 * (metric.factor || 1);
                                const display1 = metric.prefix ? `${metric.prefix}${Math.round(val1).toLocaleString()}` : raw1;
                                const display2 = metric.prefix ? `${metric.prefix}${Math.round(val2).toLocaleString()}` : raw2;
                                const winner = metric.higherBetter ? (raw1 > raw2 ? 1 : raw2 > raw1 ? 2 : 0) : (raw1 < raw2 ? 1 : raw2 < raw1 ? 2 : 0);
                                return (
                                    <tr key={metric.label} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? 'transparent' : '#fafafa' }}>
                                        <td style={{ padding: '0.875rem 1.5rem', fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {iconMap[(metric as any).icon] ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconMap[(metric as any).icon]} /></svg> : null}
                                                {metric.label}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: winner === 1 ? '#40916C' : '#0f172a', backgroundColor: winner === 1 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                            {display1} {winner === 1 && '★'}
                                        </td>
                                        <td style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: winner === 2 ? '#40916C' : '#0f172a', backgroundColor: winner === 2 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                            {display2} {winner === 2 && '★'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="compare-table-mobile" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
                    {metrics.map((metric) => {
                        const raw1 = (city1 as any)[metric.key];
                        const raw2 = (city2 as any)[metric.key];
                        const val1 = raw1 * (metric.factor || 1);
                        const val2 = raw2 * (metric.factor || 1);
                        const display1 = metric.prefix ? `${metric.prefix}${Math.round(val1).toLocaleString()}` : raw1;
                        const display2 = metric.prefix ? `${metric.prefix}${Math.round(val2).toLocaleString()}` : raw2;
                        const winner = metric.higherBetter ? (raw1 > raw2 ? 1 : raw2 > raw1 ? 2 : 0) : (raw1 < raw2 ? 1 : raw2 < raw1 ? 2 : 0);
                        return (
                            <div key={metric.label} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                                    {iconMap[(metric as any).icon] ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconMap[(metric as any).icon]} /></svg> : null}
                                    <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>{metric.label}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                    <div style={{ padding: '0.875rem 1rem', textAlign: 'center', borderRight: '1px solid #f1f5f9', backgroundColor: winner === 1 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{city1.city}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: winner === 1 ? '#40916C' : '#0f172a' }}>{display1} {winner === 1 && '★'}</div>
                                    </div>
                                    <div style={{ padding: '0.875rem 1rem', textAlign: 'center', backgroundColor: winner === 2 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{city2.city}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: winner === 2 ? '#40916C' : '#0f172a' }}>{display2} {winner === 2 && '★'}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
                <CityCard city={city1} preloadedImage={img1} />
                <CityCard city={city2} preloadedImage={img2} />
            </div>

            <div style={{ textAlign: 'center' }}>
                <Link href="/compare" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontWeight: 700 }}>
                    New Comparison
                </Link>
            </div>

            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": `${city1.city} vs ${city2.city} Cost of Living`,
                    "description": `Comparison of monthly costs: ${city1.city} $${est1} vs ${city2.city} $${est2} per month.`
                })
            }} />
        </div>
    );
}

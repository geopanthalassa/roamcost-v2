// ✅ SERVER COMPONENT — compare/[slugs]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';

interface ComparePageProps {
    params: Promise<{ slugs: string }>;
}

export async function generateMetadata({ params }: ComparePageProps) {
    const { slugs } = await params;
    const [slug1, slug2] = (slugs || '').split('-vs-');
    return {
        title: `${slug1?.replace(/-/g,' ')} vs ${slug2?.replace(/-/g,' ')} Cost of Living | RoamCost`,
        description: `Side-by-side comparison of cost of living, safety, internet and quality of life between ${slug1} and ${slug2}.`,
    };
}

export const dynamic = 'force-dynamic';

export default async function ComparePage({ params }: ComparePageProps) {
    const { slugs } = await params;
    const [slug1, slug2] = (slugs || '').split('-vs-');
    if (!slug1 || !slug2) notFound();

    const { data } = await supabase
        .from('cities_master').select('*').in('slug', [slug1, slug2]);

    const cities = (data as City[]) || [];
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

    const est1 = Math.round((city1.rent_index * 10) + (city1.food_index * 5) + (city1.transport_index * 2) + (city1.utilities_index * 3));
    const est2 = Math.round((city2.rent_index * 10) + (city2.food_index * 5) + (city2.transport_index * 2) + (city2.utilities_index * 3));

    const metrics = [
        { label: '📊 Quality Score', key: 'cost_index', higherBetter: true },
        { label: '🏠 Monthly Rent', key: 'rent_index', factor: 10, higherBetter: false, prefix: '$' },
        { label: '🍽️ Food & Dining', key: 'food_index', factor: 5, higherBetter: false, prefix: '$' },
        { label: '🚌 Transport', key: 'transport_index', factor: 2, higherBetter: false, prefix: '$' },
        { label: '⚡ Utilities', key: 'utilities_index', factor: 3, higherBetter: false, prefix: '$' },
        { label: '🛡️ Safety', key: 'safety', higherBetter: true },
        { label: '📡 Internet (Mbps)', key: 'internet', higherBetter: true },
        { label: '🏥 Healthcare', key: 'healthcare', higherBetter: true },
        { label: '🌿 Environment', key: 'environment', higherBetter: true },
    ];

    return (
        <div className="container section animate-fade-in">

            {/* Breadcrumb */}
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <Link href="/" style={{ color: '#5b8c71', fontWeight: 600 }}>Home</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <Link href="/compare" style={{ color: '#5b8c71', fontWeight: 600 }}>Compare</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{city1.city} vs {city2.city}</span>
            </nav>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
                    <span style={{ color: '#5b8c71' }}>{city1.city}</span>
                    <span style={{ color: '#94a3b8', fontSize: '2rem', margin: '0 1rem' }}>vs</span>
                    <span style={{ color: '#5b8c71' }}>{city2.city}</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    {city1.country} — {city2.country} · Cost of Living Comparison 2026
                </p>
            </div>

            {/* Monthly total comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem', border: est1 < est2 ? '2px solid #5b8c71' : '1px solid #e2e8f0', boxShadow: 'none' }}>
                    {est1 < est2 && <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', marginBottom: '0.5rem' }}>✓ More Affordable</div>}
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city1.city}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>${est1.toLocaleString()}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>per month</div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#94a3b8', textAlign: 'center' }}>vs</div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem', border: est2 < est1 ? '2px solid #5b8c71' : '1px solid #e2e8f0', boxShadow: 'none' }}>
                    {est2 < est1 && <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', marginBottom: '0.5rem' }}>✓ More Affordable</div>}
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city2.city}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>${est2.toLocaleString()}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>per month</div>
                </div>
            </div>

            {/* Comparison table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '3rem', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700 }}>Metric</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 900 }}>{city1.city}</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 900 }}>{city2.city}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric, idx) => {
                            const raw1 = (city1 as any)[metric.key];
                            const raw2 = (city2 as any)[metric.key];
                            const display1 = metric.prefix ? `${metric.prefix}${(raw1 * (metric.factor || 1)).toLocaleString()}` : raw1;
                            const display2 = metric.prefix ? `${metric.prefix}${(raw2 * (metric.factor || 1)).toLocaleString()}` : raw2;
                            const winner = metric.higherBetter ? (raw1 > raw2 ? 1 : raw2 > raw1 ? 2 : 0) : (raw1 < raw2 ? 1 : raw2 < raw1 ? 2 : 0);
                            return (
                                <tr key={metric.label} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? 'transparent' : '#fafafa' }}>
                                    <td style={{ padding: '1.1rem 2rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{metric.label}</td>
                                    <td style={{ padding: '1.1rem 2rem', textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: winner === 1 ? '#16a34a' : '#0f172a', backgroundColor: winner === 1 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                        {display1} {winner === 1 && '★'}
                                    </td>
                                    <td style={{ padding: '1.1rem 2rem', textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: winner === 2 ? '#16a34a' : '#0f172a', backgroundColor: winner === 2 ? 'rgba(22,163,74,0.05)' : 'transparent' }}>
                                        {display2} {winner === 2 && '★'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
                <CityCard city={city1} />
                <CityCard city={city2} />
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

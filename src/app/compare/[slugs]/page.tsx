import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';

interface ComparePageProps {
    params: {
        slugs: string; // formats: "paris-vs-tokyo"
    };
}

export async function generateMetadata({ params }: ComparePageProps) {
    const [city1Slug, city2Slug] = params.slugs.split('-vs-');
    if (!city1Slug || !city2Slug) return { title: 'Comparison | RoamCost' };

    return {
        title: `Compare Cost of Living: ${city1Slug.toUpperCase()} vs ${city2Slug.toUpperCase()} | RoamCost`,
        description: `Direct comparison between ${city1Slug} and ${city2Slug}. See differences in rent, food, transport, and quality of life.`,
    };
}

export default async function ComparePage({ params }: ComparePageProps) {
    const [slug1, slug2] = params.slugs.split('-vs-');

    if (!slug1 || !slug2) {
        notFound();
    }

    const { data, error } = await supabase
        .from('cities_master')
        .select('*')
        .in('slug', [slug1, slug2]);

    const cities = data as City[];

    if (error || !cities || cities.length < 2) {
        // Attempt fallback or show error
        return (
            <div className="container section">
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>Comparison data not found</h2>
                    <p>We couldn't find data for one or both of these cities.</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    const city1 = cities.find(c => c.slug === slug1)!;
    const city2 = cities.find(c => c.slug === slug2)!;

    const comparisonMetrics = [
        { label: 'Overall Cost Index', key: 'cost_index' },
        { label: 'Rent Index', key: 'rent_index' },
        { label: 'Food Index', key: 'food_index' },
        { label: 'Transport Index', key: 'transport_index' },
        { label: 'Safety', key: 'safety' },
        { label: 'Internet', key: 'internet' },
        { label: 'Healthcare', key: 'healthcare' },
    ];

    return (
        <div className="compare-page container section animate-fade-in">
            <h1 style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ color: 'var(--secondary)' }}>{city1.city}</span> vs <span style={{ color: 'var(--secondary)' }}>{city2.city}</span>
            </h1>

            {/* Comparison Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', textAlign: 'left', backgroundColor: '#f8fafc' }}>Metric</th>
                            <th style={{ padding: '1.5rem', textAlign: 'center', fontSize: '1.25rem' }}>{city1.city}</th>
                            <th style={{ padding: '1.5rem', textAlign: 'center', fontSize: '1.25rem' }}>{city2.city}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonMetrics.map((metric, idx) => {
                            const val1 = city1[metric.key as keyof City];
                            const val2 = city2[metric.key as keyof City];
                            const isHigherBetter = ['safety', 'internet', 'healthcare'].includes(metric.key);

                            const winner = isHigherBetter
                                ? (val1 > val2 ? 1 : 2)
                                : (val1 < val2 ? 1 : 2);

                            return (
                                <tr key={metric.label} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--muted)' }}>{metric.label}</td>
                                    <td style={{
                                        padding: '1.25rem',
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        color: winner === 1 ? 'var(--accent)' : 'inherit',
                                        backgroundColor: winner === 1 ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                    }}>
                                        {val1}
                                        {winner === 1 && <span style={{ marginLeft: '0.5rem' }}>🏆</span>}
                                    </td>
                                    <td style={{
                                        padding: '1.25rem',
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        color: winner === 2 ? 'var(--accent)' : 'inherit',
                                        backgroundColor: winner === 2 ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                    }}>
                                        {val2}
                                        {winner === 2 && <span style={{ marginLeft: '0.5rem' }}>🏆</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <CityCard city={city1} />
                <CityCard city={city2} />
            </div>
        </div>
    );
}

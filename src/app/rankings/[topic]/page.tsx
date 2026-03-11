import { supabase } from '@/lib/supabase';
import CityCard from '@/components/CityCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';

interface RankingPageProps {
    params: Promise<{
        topic: string;
    }>;
}

export async function generateMetadata({ params }: RankingPageProps) {
    const { topic } = await params;
    const titles: Record<string, string> = {
        cheapest: 'Cheapest Cities to Live in 2026',
        nomads: 'Best Cities for Digital Nomads',
        safest: 'Safest Cities in the World',
        quality: 'Highest Quality of Life Cities',
    };
    const title = titles[topic] || 'City Rankings';
    return { title: `${title} | RoamCost` };
}

export const dynamic = 'force-dynamic';

export default async function RankingPage({ params }: RankingPageProps) {
    const { topic } = await params;
    if (!topic) return notFound();

    let query = supabase.from('cities_master').select('*').limit(50);
    let title = 'City Rankings';
    let description = 'Discover top destinations based on your preferences.';

    if (topic === 'cheapest') {
        query = query.order('rent_index', { ascending: true });
        title = 'Cheapest Cities to Live';
        description = 'Where your monthly budget goes the furthest.';
    } else if (topic === 'nomads') {
        query = query.order('internet', { ascending: false });
        title = 'Best for Digital Nomads';
        description = 'High-speed internet and high nomad quality scores.';
    } else if (topic === 'safest') {
        query = query.order('safety', { ascending: false });
        title = 'Safest Cities Globally';
        description = 'Top destinations with the lowest crime rates.';
    } else if (topic === 'quality') {
        query = query.order('cost_index', { ascending: false });
        title = 'Highest Quality of Life';
        description = 'The ultimate balance of amenities and environment.';
    }

    const { data: cities } = await query as unknown as { data: City[] };

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em' }}>
                    {title}
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.4rem', fontWeight: 500 }}>{description}</p>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '2.5rem' }}>
                {cities?.map((city, idx) => (
                    <div key={city.slug} style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            left: '-15px',
                            zIndex: 10,
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--foreground)',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            #{idx + 1}
                        </div>
                        <CityCard city={city} />
                    </div>
                ))}
            </div>
        </div>
    );
}

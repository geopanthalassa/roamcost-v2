import { supabase } from '@/lib/supabase';
import CityCard from '@/components/CityCard';
import Link from 'next/link';

interface RankingPageProps {
    params: {
        topic: string; // "cheapest", "nomads", "safest", etc.
    };
}

export async function generateMetadata({ params }: RankingPageProps) {
    const titles: Record<string, string> = {
        cheapest: 'Cheapest Cities to Live in 2026',
        nomads: 'Best Cities for Digital Nomads',
        safest: 'Safest Cities in the World',
        quality: 'Highest Quality of Life Cities',
    };

    const title = titles[params.topic] || 'City Rankings';

    return {
        title: `${title} | RoamCost`,
        description: `Discover and compare ${title}. Powered by real-time cost and lifestyle data.`,
    };
}

export default async function RankingPage({ params }: RankingPageProps) {
    const { topic } = params;

    let query = supabase.from('cities_master').select('*').limit(50);

    let title = 'City Rankings';
    let description = 'Discover top destinations based on your preferences.';

    if (topic === 'cheapest') {
        query = query.order('rent_index', { ascending: true });
        title = '🌍 Cheapest Cities to Live';
        description = 'Where your monthly budget goes the furthest.';
    } else if (topic === 'nomads') {
        query = query.order('internet', { ascending: false });
        title = '💻 Best for Digital Nomads';
        description = 'High-speed internet and high nomad quality scores.';
    } else if (topic === 'safest') {
        query = query.order('safety', { ascending: false });
        title = '🛡️ Safest Cities Globally';
        description = 'Top destinations with the lowest crime rates and best safety metrics.';
    } else if (topic === 'quality') {
        query = query.order('cost_index', { ascending: false });
        title = '✨ Highest Quality of Life';
        description = 'The ultimate balance of amenities, environment, and community.';
    }

    const { data: cities } = await query;

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{title}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>{description}</p>
            </div>

            <div className="grid grid-cols-4">
                {cities?.map((city, idx) => (
                    <div key={city.slug} style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            zIndex: 10,
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            fontSize: '0.875rem',
                            fontWeight: 800
                        }}>
                            {idx + 1}
                        </div>
                        <CityCard city={city} />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href="/" className="btn btn-outline">Back to Home</Link>
            </div>
        </div>
    );
}

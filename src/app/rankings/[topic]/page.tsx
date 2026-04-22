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
    const meta: Record<string, { title: string; description: string; keywords: string }> = {
        cheapest: {
            title: 'Cheapest Cities to Live in 2026 | RoamCost',
            description: 'Find the most affordable cities in the world. Compare cost of living, rent prices and monthly budgets. Best cheap cities for expats, digital nomads and budget travelers.',
            keywords: 'cheapest cities to live, most affordable cities, cheap cities for expats, low cost of living cities, budget travel destinations, cheap places to retire, affordable cities europe asia latin america',
        },
        nomads: {
            title: 'Best Cities for Digital Nomads 2026 | RoamCost',
            description: 'Top cities for remote workers with fast internet, coworking spaces and affordable living. Compare digital nomad hubs worldwide — from Bali to Lisbon to Medellín.',
            keywords: 'best cities for digital nomads, remote work destinations, nomad cities, fast internet cities, coworking cities, best places to work remotely, digital nomad guide 2026',
        },
        safest: {
            title: 'Safest Cities in the World 2026 | RoamCost',
            description: 'Discover the safest cities to live and travel. Compare safety scores, crime rates and quality of life. Best secure cities for families, expats and solo travelers.',
            keywords: 'safest cities in the world, safe cities to live, low crime cities, safest places to travel, safe cities for expats, secure cities 2026',
        },
        quality: {
            title: 'Highest Quality of Life Cities 2026 | RoamCost',
            description: 'Cities with the best quality of life worldwide. Compare healthcare, safety, internet, environment and leisure scores. Find the perfect city to live well.',
            keywords: 'best quality of life cities, top cities to live, best cities in the world 2026, highest quality of life, best healthcare cities, livable cities ranking',
        },
    };
    const m = meta[topic] || { title: 'City Rankings | RoamCost', description: 'Explore city rankings by cost, safety, internet and quality of life.', keywords: 'city rankings, best cities, cost of living' };
    return {
        title: m.title,
        description: m.description,
        keywords: m.keywords,
        openGraph: { title: m.title, description: m.description, url: `https://www.roamcost.com/rankings/${topic}`, siteName: 'RoamCost', type: 'website' },
        alternates: { canonical: `https://www.roamcost.com/rankings/${topic}` },
    };
}

export const dynamic = 'force-dynamic';

export default async function RankingPage({ params }: RankingPageProps) {
    const { topic } = await params;
    if (!topic) return notFound();

    let query = supabase.from('cities_master').select('*').gt('cost_index', 0).not('population', 'is', null).limit(200);
    let title = 'City Rankings';
    let description = 'Discover top destinations based on your preferences.';

    if (topic === 'cheapest') {
        query = query.gt('population', 2000000).gt('rent_index', 0).order('rent_index', { ascending: true });
        title = 'Value Leaders';
        description = 'Global hubs where your budget stretches the furthest.';
    } else if (topic === 'nomads') {
        query = query.gt('population', 2000000).gt('internet', 0).order('internet', { ascending: false });
        title = 'Connectivity Hubs';
        description = 'Leading cities for digital work and high-speed infrastructure.';
    } else if (topic === 'safest') {
        query = query.gt('population', 2000000).gt('safety', 0).order('safety', { ascending: false });
        title = 'Safest Global Cities';
        description = 'Secured metropolitan areas with the highest safety ratings.';
    } else if (topic === 'quality') {
        query = query.gt('population', 2000000).gt('cost_index', 0).order('cost_index', { ascending: false });
        title = 'Quality of Life';
        description = 'The world\'s most established and high-functioning capitals.';
    }

    const { data: rawCities } = await query as unknown as { data: City[] };

    // De-duplicate by country, max 2 per country to keep diversity but allow big countries
    const cities: City[] = [];
    const countryCount = new Map<string, number>();

    if (rawCities) {
        for (const city of rawCities) {
            const count = countryCount.get(city.country) || 0;
            if (count < 2 && cities.length < 24) {
                cities.push(city);
                countryCount.set(city.country, count + 1);
            }
        }
    }

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                <span style={{ color: '#2BC0B4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Global Benchmarks</span>
                <h1 className="rankings-title" style={{ fontSize: '4.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.06em', marginTop: '0.5rem' }}>
                    {title}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px', margin: '1rem auto 0' }}>{description}</p>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '3rem' }}>
                {cities.map((city, idx) => (
                    <div key={city.slug} style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            zIndex: 10,
                            backgroundColor: '#0f172a',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            letterSpacing: '0.05em'
                        }}>
                            RANK {idx + 1}
                        </div>
                        <CityCard city={city} />
                    </div>
                ))}
            </div>
        </div>
    );
}

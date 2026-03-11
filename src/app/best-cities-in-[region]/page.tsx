import { supabase } from '@/lib/supabase';
import CityCard from '@/components/CityCard';
import Link from 'next/link';

interface RegionalPageProps {
    params: {
        region: string;
    };
}

export default async function BestCitiesInRegionPage({ params }: RegionalPageProps) {
    const regionName = params.region.replace(/-/g, ' ');

    const { data: cities } = await supabase
        .from('cities_master')
        .select('*')
        .ilike('country', regionName)
        .order('cost_index', { ascending: false })
        .limit(20);

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆 Best Cities in {regionName}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Top rated destinations in {regionName} based on quality of life and infrastructure.</p>
            </div>

            <div className="grid grid-cols-4">
                {cities?.map((city) => (
                    <CityCard key={city.slug} city={city} />
                ))}
            </div>

            {(!cities || cities.length === 0) && (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>No cities found for this region.</p>
                </div>
            )}

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href="/" className="btn btn-outline">Back to Home</Link>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: RegionalPageProps) {
    const name = params.region.replace(/-/g, ' ').toUpperCase();
    return {
        title: `Best Cities to Live in ${name} | RoamCost`,
        description: `Ranking the top cities in ${name} by quality of life, safety, and internet speed.`,
    };
}

import { supabase } from '@/lib/supabase';
import CityCard from '@/components/CityCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { City } from '@/types/database';

interface RegionalPageProps {
    params: Promise<{
        region: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function CheapestCitiesInRegionPage({ params }: RegionalPageProps) {
    const { region } = await params;

    if (!region) {
        return notFound();
    }

    const regionName = region.replace(/-/g, ' ');

    const { data: cities } = await supabase
        .from('cities_master')
        .select('*')
        .ilike('country', regionName)
        .order('rent_index', { ascending: true })
        .limit(20) as unknown as { data: City[] };

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Cheapest Cities in {regionName}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Most affordable destinations in {regionName} by monthly rent and cost of living.</p>
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
    const { region } = await params;
    if (!region) return { title: 'Region Rankings | RoamCost' };
    const name = region.replace(/-/g, ' ').toUpperCase();
    return {
        title: `Cheapest Cities to Live in ${name} | RoamCost`,
        description: `Ranking the most budget-friendly cities in ${name} by rent index and food costs.`,
    };
}

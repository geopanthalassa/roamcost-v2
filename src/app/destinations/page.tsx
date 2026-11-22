import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { getDestinationSlugs } from '@/lib/destinations';
import type { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Best Travel Destinations & 3-Day Itineraries | RoamCost',
    description: 'Top destinations with a must-see 3-day itinerary for each, built from real Google ratings, plus what a month of living there costs.',
    alternates: { canonical: 'https://www.roamcost.com/destinations' },
};

interface Row { slug: string; city: string; country: string; total_usd: number | null; }

export default async function DestinationsPage() {
    const slugs = await getDestinationSlugs();
    const { data } = await supabase
        .from('cities_master')
        .select('slug, city, country, total_usd')
        .in('slug', slugs);
    const rows = ((data || []) as unknown as Row[]).sort((a, b) => a.city.localeCompare(b.city));

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '3rem 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Destinations</p>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', margin: '0 0 1rem', letterSpacing: '-0.03em' }}>Best Destinations and Must-See Itineraries</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: '640px' }}>
                        Pick a city to get a 3-day itinerary built from real Google ratings: the landmarks people visit most, hidden gems, and where to eat. Each page also shows what living there costs per month.
                    </p>
                </div>
            </div>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {rows.map(r => (
                        <Link key={r.slug} href={`/destinations/${r.slug}`}
                            style={{ display: 'block', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', textDecoration: 'none' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{r.city}</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{r.country}</div>
                            {r.total_usd ? (
                                <div style={{ color: '#40916C', fontWeight: 700, fontSize: '0.85rem' }}>About ${r.total_usd.toLocaleString()}/month to live</div>
                            ) : null}
                            <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>3-day itinerary →</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

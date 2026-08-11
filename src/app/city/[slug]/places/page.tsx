import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props { params: Promise<{ slug: string }> }

interface Place {
    id: string;
    category: string;
    name: string;
    rating: number | null;
    rating_count: number | null;
    address: string | null;
    maps_url: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
    restaurant_top_rated: 'Best Rated Restaurants',
    restaurant_cheap_good: 'Affordable & Good',
    restaurant_luxury: 'Fine Dining',
    attraction_must_see: 'Must-See Attractions',
    attraction_hidden_gem: 'Hidden Gems',
    parking: 'Parking',
};

const CATEGORY_ORDER = ['restaurant_top_rated', 'restaurant_cheap_good', 'restaurant_luxury', 'attraction_must_see', 'attraction_hidden_gem', 'parking'];

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country').eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!data) return { title: 'Places | RoamCost' };
    const d = data as { city: string; country: string };
    return {
        title: `Best Restaurants, Attractions & Parking in ${d.city} | RoamCost`,
        description: `Real, rated places to eat, visit and park in ${d.city}, ${d.country}. Curated from Google ratings for travelers and digital nomads.`,
        alternates: { canonical: `https://www.roamcost.com/city/${slug}/places` },
    };
}

export default async function PlacesPage({ params }: Props) {
    const { slug } = await params;

    const { data: cityData } = await supabase.from('cities_master').select('city, country, slug').eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!cityData) notFound();
    const city = cityData as { city: string; country: string; slug: string };

    const { data: placesData } = await supabase.from('city_places').select('*').eq('city_slug', slug);
    const places = (placesData || []) as Place[];

    const grouped: Record<string, Place[]> = {};
    for (const p of places) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
    }

    const hasPlaces = places.length > 0;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 1.5rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <nav style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>→</span>
                    <Link href={`/city/${slug}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{city.city}</Link>
                    <span style={{ margin: '0 0.5rem' }}>→</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>Places to Go</span>
                </nav>

                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Best Places in {city.city}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2.5rem' }}>
                    Real, rated restaurants, attractions and parking -- curated from Google for travelers and digital nomads.
                </p>

                {!hasPlaces && (
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>We're still curating places for {city.city}. Check back soon.</p>
                    </div>
                )}

                {hasPlaces && CATEGORY_ORDER.map(category => {
                    const items = grouped[category];
                    if (!items || items.length === 0) return null;
                    return (
                        <div key={category} style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                                {CATEGORY_LABELS[category] || category}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                                {items.map(place => (
                                    <a key={place.id} href={place.maps_url || '#'} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'block', backgroundColor: 'white', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.35rem' }}>{place.name}</div>
                                        {place.rating != null && (
                                            <div style={{ fontSize: '0.8rem', color: '#40916C', fontWeight: 700, marginBottom: '0.35rem' }}>
                                                Rating: {place.rating} {place.rating_count ? `(${place.rating_count.toLocaleString()} reviews)` : ''}
                                            </div>
                                        )}
                                        {place.address && (
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{place.address}</div>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '2rem', marginTop: '1rem', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Planning your stay?</p>
                    <h3 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem' }}>See the full cost of living in {city.city}</h3>
                    <Link href={`/city/${slug}`} style={{ backgroundColor: '#52B788', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>Back to {city.city} overview →</Link>
                </div>
            </div>
        </div>
    );
}

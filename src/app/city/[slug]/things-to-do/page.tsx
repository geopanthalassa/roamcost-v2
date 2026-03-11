import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

import { City } from '@/types/database';

interface ThingsToDoProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getFoursquarePlaces(lat: number, lng: number) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY!,
        }
    };

    try {
        const response = await fetch(
            `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&limit=12&categories=16000,10000,19000`, // landmarks, arts, travel
            options
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Foursquare API Error:', error);
        return [];
    }
}

export default async function ThingsToDoPage({ params }: ThingsToDoProps) {
    const { slug } = await params;
    const { data: city, error } = await supabase
        .from('cities_master')
        .select('*')
        .eq('slug', slug)
        .single() as unknown as { data: City; error: any };

    if (error || !city) {
        notFound();
    }

    const places = await getFoursquarePlaces(city.lat, city.lng);

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Things to do in {city.city}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Discover the best attractions and landmarks in {city.city}, {city.country}.</p>
            </div>

            {places.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>We couldn't find any specific places for this area right now. Try exploring the city center!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {places.map((place: any) => (
                        <div key={place.fsq_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    {place.categories?.[0]?.name || 'Attraction'}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{place.name}</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)' }}>
                                {place.location?.address || 'City Center'}
                            </p>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                    {Math.round(place.distance / 100) / 10} km from center
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href={`/city/${city.slug}`} className="btn btn-primary">
                    Back to {city.city} Overview
                </Link>
            </div>
        </div>
    );
}

import Link from 'next/link';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';

interface CityPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: CityPageProps) {
    const { data: city } = await supabase
        .from('cities_master')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!city) return { title: 'City Not Found | RoamCost' };

    return {
        title: `Cost of Living in ${city.city}, ${city.country} | RoamCost`,
        description: `Detailed cost of living, safety, healthcare, and quality of life metrics for ${city.city}, ${city.country}. Compare prices and lifestyle before you move.`,
    };
}

export default async function CityPage({ params }: CityPageProps) {
    const { data: city, error } = await supabase
        .from('cities_master')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (error || !city) {
        notFound();
    }

    const cityData = city as City;

    const costMetrics = [
        { label: 'Rent Index', value: cityData.rent_index, color: '#3b82f6' },
        { label: 'Food Index', value: cityData.food_index, color: '#10b981' },
        { label: 'Transport', value: cityData.transport_index, color: '#f59e0b' },
        { label: 'Utilities', value: cityData.utilities_index, color: '#6366f1' },
        { label: 'Entertainment', value: cityData.entertainment_index, color: '#ec4899' },
        { label: 'Total Index', value: cityData.cost_index, color: '#0f172a' },
    ];

    const qualityMetrics = [
        { label: 'Safety', value: cityData.safety },
        { label: 'Healthcare', value: cityData.healthcare },
        { label: 'Internet', value: cityData.internet },
        { label: 'Environment', value: cityData.environment },
        { label: 'Commute', value: cityData.commute },
        { label: 'Leisure', value: cityData.leisure },
        { label: 'Outdoors', value: cityData.outdoors },
    ];

    return (
        <div className="city-page container section animate-fade-in">
            {/* Hero Section */}
            <div className="city-hero card" style={{ padding: '3rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden', minHeight: '400px', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(https://source.unsplash.com/featured/?${city.city},${city.country},architecture)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.6)'
                }} />
                <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <h1 style={{ marginBottom: '0.5rem', fontSize: '4rem' }}>{city.city}</h1>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>{city.country} • {city.population.toLocaleString()} inhabitants</p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700 }}>
                            Overall Score: {city.cost_index}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2">
                {/* Cost of Living Section */}
                <section className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        💰 Cost of Living
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {costMetrics.map((metric) => (
                            <div key={metric.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                    <span>{metric.label}</span>
                                    <span>{metric.value}</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(metric.value, 100)}%`,
                                        backgroundColor: metric.color,
                                        transition: 'width 1s ease-out'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quality of Life Section */}
                <section className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ✨ Quality of Life
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem'
                    }}>
                        {qualityMetrics.map((metric) => (
                            <div key={metric.label} style={{ textAlign: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{metric.value}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>{metric.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2.5rem' }}>
                        <Link href={`/city/${city.slug}/things-to-do`} className="btn btn-outline" style={{ width: '100%' }}>
                            Explore Things to Do in {city.city} →
                        </Link>
                    </div>
                </section>
            </div>

            {/* Map Section Mockup */}
            <div className="card" style={{ marginTop: '3rem', padding: '2rem' }}>
                <h3>Location</h3>
                <div style={{ height: '300px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                    Map View ({city.lat}, {city.long})
                </div>
            </div>
        </div>
    );
}

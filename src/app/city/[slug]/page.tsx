'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import React, { useEffect, useState, use } from 'react';

interface CityPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function CityPage({ params }: CityPageProps) {
    const { formatValue } = useCurrency();
    const resolvedParams = use(params);
    const [city, setCity] = useState<City | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('cities_master')
                .select('*')
                .eq('slug', resolvedParams.slug)
                .single();
            setCity(data as City);
            setLoading(false);
        };
        fetchData();
    }, [resolvedParams.slug]);

    if (loading) return <div className="container section">Loading city details...</div>;
    if (!city) notFound();

    const costMetrics = [
        { label: 'Rent Index', value: city.rent_index, color: 'var(--primary)', isPrice: true, factor: 10 },
        { label: 'Food Index', value: city.food_index, color: 'var(--secondary)', isPrice: true, factor: 5 },
        { label: 'Transport', value: city.transport_index, color: 'var(--accent)', isPrice: true, factor: 2 },
        { label: 'Utilities', value: city.utilities_index, color: '#6366f1', isPrice: true, factor: 3 },
    ];

    const qualityMetrics = [
        { label: 'Safety', value: city.safety },
        { label: 'Healthcare', value: city.healthcare },
        { label: 'Internet', value: city.internet },
        { label: 'Environment', value: city.environment },
    ];

    const dynamicImage = `https://source.unsplash.com/featured/1200x600?${encodeURIComponent(city.city)},cityscape`;

    return (
        <div className="city-page container section animate-fade-in">
            {/* Hero Section */}
            <div className="city-hero card" style={{
                padding: '4rem',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '450px',
                display: 'flex',
                alignItems: 'flex-end',
                border: 'none',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-xl)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${dynamicImage}), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)'
                }} />
                <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <h1 style={{ marginBottom: '0.75rem', fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{city.city}</h1>
                    <p style={{ fontSize: '1.75rem', opacity: 0.9, fontWeight: 600 }}>{city.country} • {city.population.toLocaleString()} inhabitants</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
                        <span style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 900, fontSize: '1.1rem' }}>
                            Quality Score: {city.cost_index}
                        </span>
                        <WeatherWidget lat={city.lat} lon={city.lng} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                {/* Cost Section */}
                <section className="card" style={{ padding: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                        Living Costs
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {costMetrics.map((metric) => (
                            <div key={metric.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 700 }}>
                                    <span style={{ color: 'var(--muted)' }}>{metric.label}</span>
                                    <span style={{ color: 'var(--foreground)', fontSize: '1.1rem' }}>{formatValue(metric.value * metric.factor)}</span>
                                </div>
                                <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(metric.value, 100)}%`,
                                        backgroundColor: metric.color,
                                        borderRadius: '6px'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quality Section */}
                <section className="card" style={{ padding: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                        Lifestyle Quality
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {qualityMetrics.map((metric) => (
                            <div key={metric.label} style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fbfbff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.25rem' }}>{metric.value}</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <Link href={`/city/${city.slug}/things-to-do`} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                            View Local Experiences →
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

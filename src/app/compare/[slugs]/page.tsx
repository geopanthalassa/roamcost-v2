'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import { useCurrency } from '@/context/CurrencyContext';
import React, { useEffect, useState, use } from 'react';

interface ComparePageProps {
    params: Promise<{
        slugs: string;
    }>;
}

export default function ComparePage({ params }: ComparePageProps) {
    const { formatValue } = useCurrency();
    const resolvedParams = use(params);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const slugs = resolvedParams.slugs;
        if (!slugs) return;
        const [slug1, slug2] = slugs.split('-vs-');
        if (!slug1 || !slug2) return;

        const fetchData = async () => {
            const { data } = await supabase
                .from('cities_master')
                .select('*')
                .in('slug', [slug1, slug2]);
            setCities((data as City[]) || []);
            setLoading(false);
        };
        fetchData();
    }, [resolvedParams.slugs]);

    if (loading) return <div className="container section">Loading comparison...</div>;

    const [slug1, slug2] = resolvedParams.slugs.split('-vs-');
    const city1 = cities.find(c => c.slug === slug1);
    const city2 = cities.find(c => c.slug === slug2);

    if (!city1 || !city2) {
        return (
            <div className="container section">
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Data not found</h2>
                    <p>We couldn't find enough data to compare these locations.</p>
                    <Link href="/compare" className="btn btn-primary" style={{ marginTop: '2rem' }}>Try Another Comparison</Link>
                </div>
            </div>
        );
    }

    const comparisonMetrics = [
        { label: 'Overall Quality Score', key: 'cost_index', isPrice: false },
        { label: 'Monthly Rent Est.', key: 'rent_index', isPrice: true, factor: 10 },
        { label: 'Food & Dining', key: 'food_index', isPrice: true, factor: 5 },
        { label: 'Transport', key: 'transport_index', isPrice: true, factor: 2 },
        { label: 'Safety Score', key: 'safety', isPrice: false },
        { label: 'Internet Speed', key: 'internet', isPrice: false },
        { label: 'Healthcare Quality', key: 'healthcare', isPrice: false },
    ];

    return (
        <div className="compare-page container section animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontWeight: 900, fontSize: '3.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>{city1.city}</span> <span style={{ color: 'var(--muted)', fontSize: '2rem' }}>vs</span> <span style={{ color: 'var(--primary)' }}>{city2.city}</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Detailed side-by-side breakdown of living standards and costs.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                            <th style={{ padding: '2rem', textAlign: 'left', fontSize: '1.1rem' }}>Key Metric</th>
                            <th style={{ padding: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 900 }}>{city1.city}</th>
                            <th style={{ padding: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 900 }}>{city2.city}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonMetrics.map((metric, idx) => {
                            const raw1 = (city1 as any)[metric.key];
                            const raw2 = (city2 as any)[metric.key];
                            const val1 = metric.isPrice ? formatValue(raw1 * (metric.factor || 1)) : raw1;
                            const val2 = metric.isPrice ? formatValue(raw2 * (metric.factor || 1)) : raw2;

                            const isHigherBetter = ['safety', 'internet', 'healthcare', 'cost_index'].includes(metric.key);
                            const winner = isHigherBetter ? (raw1 > raw2 ? 1 : 2) : (raw1 < raw2 ? 1 : 2);

                            return (
                                <tr key={metric.label} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                                    <td style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--muted)' }}>{metric.label}</td>
                                    <td style={{
                                        padding: '1.5rem 2rem',
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: winner === 1 ? 'var(--primary)' : 'var(--foreground)',
                                        backgroundColor: winner === 1 ? 'rgba(79, 70, 229, 0.03)' : 'transparent'
                                    }}>
                                        {val1}
                                        {winner === 1 && <span style={{ marginLeft: '0.5rem', color: 'var(--secondary)' }}>★</span>}
                                    </td>
                                    <td style={{
                                        padding: '1.5rem 2rem',
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: winner === 2 ? 'var(--primary)' : 'var(--foreground)',
                                        backgroundColor: winner === 2 ? 'rgba(79, 70, 229, 0.03)' : 'transparent'
                                    }}>
                                        {val2}
                                        {winner === 2 && <span style={{ marginLeft: '0.5rem', color: 'var(--secondary)' }}>★</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <CityCard city={city1} />
                <CityCard city={city2} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <Link href="/compare" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>Make New Comparison</Link>
            </div>
        </div>
    );
}

import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityImageServer } from '@/lib/getCityImageServer';

const REGIONS: Record<string, {
    label: string;
    description: string;
    countries: string[];
    keywords: string;
}> = {
    europe: {
        label: 'Europe',
        description: 'Compare cost of living across European cities — from budget-friendly Eastern Europe to premium Western capitals.',
        keywords: 'cheapest cities europe, cost of living europe, europe city comparison, affordable europe cities, move to europe',
        countries: ['United Kingdom','Germany','France','Spain','Italy','Netherlands','Portugal','Belgium','Sweden','Norway','Denmark','Finland','Austria','Switzerland','Poland','Czech Republic','Hungary','Romania','Greece','Ireland','Croatia','Bulgaria','Slovakia','Slovenia','Estonia','Latvia','Lithuania','Serbia','Ukraine','Belarus','Moldova','Albania','North Macedonia','Kosovo','Montenegro','Bosnia and Herzegovina','Luxembourg','Malta','Cyprus','Iceland'],
    },
    asia: {
        label: 'Asia',
        description: 'Explore cost of living in Asian cities — from ultra-affordable Southeast Asia to premium Singapore and Tokyo.',
        keywords: 'cheapest cities asia, cost of living asia, southeast asia living costs, move to asia, digital nomad asia',
        countries: ['Japan','China','South Korea','Taiwan','Singapore','Thailand','Malaysia','Indonesia','Vietnam','Philippines','India','Bangladesh','Pakistan','Sri Lanka','Nepal','Cambodia','Myanmar','Laos','Mongolia','Hong Kong','Macau','Brunei','Timor-Leste'],
    },
    'latin-america': {
        label: 'Latin America',
        description: 'Discover affordable living in Latin American cities — vibrant culture at a fraction of Western costs.',
        keywords: 'cheapest cities latin america, cost of living latin america, move to latin america, digital nomad south america',
        countries: ['Mexico','Brazil','Argentina','Colombia','Chile','Peru','Venezuela','Ecuador','Bolivia','Paraguay','Uruguay','Cuba','Dominican Republic','Guatemala','Honduras','El Salvador','Nicaragua','Costa Rica','Panama','Haiti','Puerto Rico'],
    },
    'north-america': {
        label: 'North America',
        description: 'Compare cost of living across US and Canadian cities — find the most affordable places to live in North America.',
        keywords: 'cheapest cities north america, cost of living usa canada, affordable us cities, move to north america',
        countries: ['United States','Canada'],
    },
    africa: {
        label: 'Africa',
        description: 'Cost of living across African cities — emerging markets with growing expat communities.',
        keywords: 'cheapest cities africa, cost of living africa, move to africa, expat africa',
        countries: ['South Africa','Nigeria','Kenya','Ethiopia','Egypt','Morocco','Ghana','Tanzania','Uganda','Angola','Cameroon','Ivory Coast','Senegal','Mali','Sudan','Algeria','Tunisia','Libya','Rwanda','Zimbabwe','Zambia','Mozambique'],
    },
    'middle-east': {
        label: 'Middle East',
        description: 'Cost of living in Middle Eastern cities — from tax-free Dubai to more affordable regional capitals.',
        keywords: 'cost of living middle east, cheapest cities middle east, move to middle east, expat middle east dubai',
        countries: ['United Arab Emirates','Saudi Arabia','Israel','Turkey','Qatar','Kuwait','Bahrain','Oman','Jordan','Lebanon','Iraq','Iran'],
    },
    oceania: {
        label: 'Oceania',
        description: 'Cost of living in Australian and New Zealand cities — premium quality of life in the Pacific.',
        keywords: 'cost of living australia, cheapest cities australia, move to australia new zealand, expat oceania',
        countries: ['Australia','New Zealand','Papua New Guinea','Fiji'],
    },
};

interface Props { params: Promise<{ region: string }> }

export async function generateStaticParams() {
    return Object.keys(REGIONS).map(r => ({ region: r }));
}

export async function generateMetadata({ params }: Props) {
    const { region } = await params;
    const r = REGIONS[region];
    if (!r) return { title: 'Region Not Found' };
    return {
        title: `Cheapest Cities in ${r.label} 2026 | Cost of Living | RoamCost`,
        description: r.description,
        keywords: r.keywords,
        openGraph: { title: `Cost of Living in ${r.label} — City Rankings 2026`, description: r.description, url: `https://www.roamcost.com/rankings/region/${region}` },
        alternates: { canonical: `https://www.roamcost.com/rankings/region/${region}` },
    };
}

export const dynamic = 'force-dynamic';

export default async function RegionRankingPage({ params }: Props) {
    const { region } = await params;
    const regionData = REGIONS[region];
    if (!regionData) notFound();

    const { data: cities } = await supabase
        .from('cities_master')
        .select('*')
        .in('country', regionData.countries)
        .gt('cost_index', 0)
        .gt('population', 500000)
        .order('rent_index', { ascending: true })
        .limit(50) as unknown as { data: City[] };

    const validCities = (cities || []).filter(c =>
        (c.rent_index ?? 0) > 0
    );

    // Prefetch images
    const imageMap: Record<string, string> = {};
    try {
        await Promise.all(validCities.slice(0, 24).map(async c => {
            try {
                imageMap[c.slug] = await getCityImageServer(c.slug, c.city, c.country, 400);
            } catch { /* skip */ }
        }));
    } catch { /* continue */ }

    const GREEN = '#52B788';
    const JADE = '#40916C';
    const ORANGE = '#F7831E';

    const otherRegions = Object.entries(REGIONS).filter(([key]) => key !== region);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#0f172a', padding: '3rem 0 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <nav style={{ marginBottom: '1.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                        <Link href="/rankings/cheapest" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Rankings</Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                        <span style={{ color: 'white' }}>{regionData.label}</span>
                    </nav>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>
                        Cost of Living by Region
                    </p>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '0 0 1rem', letterSpacing: '-0.04em' }}>
                        Cheapest Cities in {regionData.label}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: 0, maxWidth: '600px' }}>
                        {regionData.description}
                    </p>
                </div>
            </div>

            {/* Region nav pills */}
            <div style={{ backgroundColor: '#1e293b', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {Object.entries(REGIONS).map(([key, r]) => (
                        <Link key={key} href={`/rankings/region/${key}`}
                            style={{
                                padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700,
                                textDecoration: 'none',
                                backgroundColor: key === region ? GREEN : 'rgba(255,255,255,0.08)',
                                color: key === region ? 'white' : 'rgba(255,255,255,0.6)',
                                border: key === region ? 'none' : '1px solid rgba(255,255,255,0.15)',
                            }}>
                            {r.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

                {/* Stats bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Cities ranked', value: validCities.length },
                        { label: 'Most affordable', value: validCities[0]?.city || '—' },
                        { label: 'Avg monthly cost', value: validCities.length ? `$${Math.round(validCities.slice(0,10).reduce((s,c) => s + (c.rent_index||0) + (c.food_index||0)*30 + (c.transport_index||0) + (c.utilities_index||0), 0) / Math.min(10, validCities.length)).toLocaleString()}` : '—' },
                    ].map(s => (
                        <div key={s.label} style={{ backgroundColor: 'white', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: GREEN }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '3rem' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    {['#', 'City', 'Monthly Cost', 'Rent', 'Food/mo', 'Safety', 'Internet', 'Score'].map(h => (
                                        <th key={h} style={{ padding: '0.875rem 1rem', textAlign: h === '#' ? 'center' : 'left', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {validCities.map((city, i) => {
                                    const monthly = Math.round((city.rent_index||0) + (city.food_index||0)*30 + (city.transport_index||0) + (city.utilities_index||0));
                                    const safetyColor = (city.safety||0) >= 7 ? JADE : (city.safety||0) >= 5 ? ORANGE : '#dc2626';
                                    return (
                                        <tr key={city.slug} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                                            <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 800, color: i < 3 ? GREEN : '#94a3b8', fontSize: '0.85rem' }}>
                                                {i + 1}
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <Link href={`/city/${city.slug}`} style={{ textDecoration: 'none' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                                        {imageMap[city.slug] && (
                                                            <img src={imageMap[city.slug]} alt={city.city}
                                                                style={{ width: '44px', height: '44px', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{city.city}</div>
                                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{city.country}</div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <span style={{ fontWeight: 900, color: GREEN, fontSize: '0.95rem' }}>${monthly.toLocaleString()}</span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>/mo</span>
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                                                {(city.rent_index||0) > 0 ? `$${Math.round(city.rent_index||0).toLocaleString()}` : '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                                                {(city.food_index||0) > 0 ? `$${Math.round((city.food_index||0)*30).toLocaleString()}` : '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                {(city.safety||0) > 0 ? (
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: safetyColor }}>{city.safety}/10</span>
                                                ) : '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                                                {(city.internet||0) > 0 ? `${city.internet} Mbps` : '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                {(city.cost_index||0) > 0 ? (
                                                    <span style={{ backgroundColor: '#F0FAF4', color: GREEN, fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                        {Math.round(city.cost_index||0)}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Other regions */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Explore other regions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                    {otherRegions.map(([key, r]) => (
                        <Link key={key} href={`/rankings/region/${key}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{r.label}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

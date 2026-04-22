// SERVER COMPONENT - Google indexa todo
import { supabase } from '@/lib/supabase';
import { getCityImageServer } from '@/lib/getCityImageServer';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import { getCityImageServer } from '@/lib/getCityImageServer';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import WeatherWidget from '@/components/WeatherWidget';
import CostPersonalizer from '@/components/CostPersonalizer';

interface CityPageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: CityPageProps) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country, cost_index, rent_index, safety').eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!data) return { title: 'City Not Found | RoamCost' };
    const d = data as { city: string; country: string; cost_index: number; rent_index: number; safety: number };
    const title = `Cost of Living in ${d.city}, ${d.country} 2026 | RoamCost`;
    const description = `Move to ${d.city}? Compare rent ($${Math.round(d.rent_index)}/mo), food, safety (${d.safety}/10) and quality of life. Real data for digital nomads, expats and travelers.`;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://www.roamcost.com/city/${slug}`,
            siteName: 'RoamCost',
            type: 'website',
        },
        twitter: { card: 'summary_large_image', title, description },
        alternates: { canonical: `https://www.roamcost.com/city/${slug}` },
        keywords: `cost of living ${d.city}, ${d.city} rent prices, living in ${d.city}, ${d.city} expat guide, ${d.city} digital nomad, ${d.city} ${d.country} cost`,
    };
}

export const dynamic = 'force-dynamic';

export default async function CityPage({ params }: CityPageProps) {
    const { slug } = await params;

    const { data } = await supabase
        .from('cities_master').select('*')
        .eq('slug', slug)
        .order('cost_index', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!data) notFound();
    const c = data as unknown as City;

    const hasData = (c.cost_index ?? 0) > 0;
    const heroImage = await getCityImageServer(c.slug, c.city, c.country, 1400);

    const { data: related } = await supabase
        .from('cities_master').select('*')
        .eq('country', c.country)
        .neq('slug', slug)
        .gt('cost_index', 0)
        .order('population', { ascending: false })
        .limit(3) as unknown as { data: City[] };

    // Prefetch related city images server-side
    const relatedImages: Record<string, string> = {};
    if (related) {
        await Promise.all(related.map(async (rc) => {
            relatedImages[rc.slug] = await getCityImageServer(rc.slug, rc.city, rc.country, 400);
        }));
    }

    const rent = (c.rent_index ?? 0);
    const food = (c.food_index ?? 0) * 30;
    const transport = (c.transport_index ?? 0);
    const utilities = (c.utilities_index ?? 0);
    const monthly = Math.round(rent + food + transport + utilities);

    const schemaOrg = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Cost of Living in ${c.city}, ${c.country} 2026`,
        description: `Complete cost of living guide for ${c.city}. Monthly rent, food, transport and quality of life data.`,
        url: `https://www.roamcost.com/city/${slug}`,
        publisher: { '@type': 'Organization', name: 'RoamCost', url: 'https://www.roamcost.com' },
        about: { '@type': 'City', name: c.city, containedInPlace: { '@type': 'Country', name: c.country } },
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

            {/* HERO with real Pexels image */}
            <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
                <img src={heroImage} alt={`${c.city} cityscape`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />

                <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', padding: '0 1.5rem' }}>
                    <nav style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 0.5rem' }}>→</span>
                        <Link href="/rankings/quality" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Cities</Link>
                        <span style={{ margin: '0 0.5rem' }}>→</span>
                        <span style={{ color: 'white', fontWeight: 600 }}>{c.city}</span>
                    </nav>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', padding: '0 1.5rem 2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.75)', marginBottom: '0.5rem' }}>
                                {c.country}{c.population ? ` • ${c.population.toLocaleString()} inhabitants` : ''}
                            </p>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '1rem' }}>{c.city}</h1>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {hasData && monthly > 0 && (
                                    <span style={{ backgroundColor: '#52B788', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '2rem', fontWeight: 800, fontSize: '0.95rem' }}>
                                        ~${monthly.toLocaleString()}/month
                                    </span>
                                )}
                                {hasData && c.cost_index != null && (
                                    <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.25)' }}>
                                        Quality Score: {c.cost_index}
                                    </span>
                                )}
                                {!hasData && (
                                    <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.25)' }}>
                                        📍 Travel destination
                                    </span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {hasData && (
                                <Link href={`/compare?city1=${c.slug}`} style={{ backgroundColor: 'white', color: '#0f172a', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.875rem', textDecoration: 'none' }}>Compare →</Link>
                            )}
                            <Link href={`/city/${c.slug}/things-to-do`} style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>Things to do</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

                {hasData ? (
                    <>
                        {/* Stats cards - scroll horizontal en mobile */}
                        <div className="city-stats-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Monthly Budget', value: `$${monthly.toLocaleString()}`, sub: 'all-in estimate', color: '#52B788', bg: '#F0FAF4' },
                                { label: 'Annual Cost', value: `$${(monthly * 12).toLocaleString()}`, sub: 'per year', color: '#3b82f6', bg: '#eff6ff' },
                                { label: 'Internet', value: c.internet != null ? `${c.internet} Mbps` : 'N/A', sub: (c.internet ?? 0) >= 50 ? 'Excellent' : (c.internet ?? 0) >= 20 ? 'Good' : 'Limited', color: '#8b5cf6', bg: '#f5f3ff' },
                                { label: 'Safety', value: c.safety != null ? `${c.safety}/10` : 'N/A', sub: (c.safety ?? 0) >= 7 ? 'Very safe' : (c.safety ?? 0) >= 5 ? 'Moderate' : 'Caution', color: (c.safety ?? 0) >= 7 ? '#40916C' : '#d97706', bg: (c.safety ?? 0) >= 7 ? '#F0FAF4' : '#fffbeb' },
                            ].map(s => (
                                <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '1rem', padding: '1.25rem', border: `1px solid ${s.color}22`, minWidth: '140px' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div className="city-data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Monthly Living Costs</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.75rem' }}>Estimated breakdown in USD</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { label: 'Rent / Housing', usd: rent, value: c.rent_index ?? 0, color: '#52B788', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                                        { label: 'Food & Dining', usd: food, value: c.food_index ?? 0, color: '#3b82f6', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
                                        { label: 'Transport', usd: transport, value: c.transport_index ?? 0, color: '#8b5cf6', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
                                        { label: 'Utilities', usd: utilities, value: c.utilities_index ?? 0, color: '#f59e0b', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                                    ].map((m) => (
                                        <div key={m.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                                <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{m.svg}{m.label}</span>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>${Math.round(m.usd).toLocaleString()}</span>
                                                    <CurrencyDisplay usdAmount={m.usd} />
                                                </div>
                                            </div>
                                            <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min(m.value, 100)}%`, backgroundColor: m.color, borderRadius: '3px' }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ paddingTop: '1rem', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, color: '#0f172a' }}>Total</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#52B788' }}>${monthly.toLocaleString()}/mo</span>
                                            <CurrencyDisplay usdAmount={monthly} large />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Quality of Life</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.75rem' }}>Indexed scores for key life factors</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Safety', value: c.safety, max: 10, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                                        { label: 'Healthcare', value: c.healthcare, max: 10, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
                                        { label: 'Internet', value: c.internet, unit: 'Mbps', max: 100, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> },
                                        { label: 'Environment', value: c.environment, max: 10, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.38 1.37C7.14 19.14 10.5 18 13 18c5 0 9-4 9-9"/><path d="M17 8l-5 5"/></svg> },
                                        { label: 'Leisure', value: c.leisure, max: 10, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
                                        { label: 'Outdoors', value: c.outdoors, max: 10, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
                                    ].map((m) => {
                                        const val = m.value ?? 0;
                                        const good = m.max === 100 ? val >= 30 : val >= 6;
                                        const iconColor = good ? '#40916C' : '#94a3b8';
                                        return (
                                            <div key={m.label} style={{ padding: '1rem', backgroundColor: good ? '#F0FAF4' : '#fafafa', border: `1px solid ${good ? '#D8F3DC' : '#e2e8f0'}`, borderRadius: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.3rem', color: iconColor }}>{m.svg}</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: good ? '#40916C' : '#94a3b8' }}>
                                                    {m.value != null ? m.value : '—'}{m.unit ? ` ${m.unit}` : ''}
                                                </div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Detailed cost data coming soon for {c.city}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
                            We're working on adding detailed cost of living data for this city. Meanwhile, explore hotels, flights and local experiences below.
                        </p>
                        <Link href="/rankings/quality" style={{ display: 'inline-block', backgroundColor: '#52B788', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
                            See cities with full data →
                        </Link>
                    </div>
                )}

                {/* COST PERSONALIZER */}
                {hasData && (
                    <CostPersonalizer
                        baseRent={rent}
                        baseFood={food}
                        baseTransport={transport}
                        baseUtilities={utilities}
                        city={c.city}
                    />
                )}

                {/* WEATHER */}
                <WeatherWidget lat={c.lat} long={c.long} city={c.city} />

                {/* TRAVEL — always visible */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.41 16z"/></svg>
                        Plan your trip to {c.city}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Find the best deals on flights, hotels and long-term stays</p>
                    <div className="travel-links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {[
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                                label: `Hotels in ${c.city}`, sub: 'Booking.com', color: '#003580', bg: '#eff6ff',
                                href: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(c.city + ', ' + c.country)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8612c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
                                label: `Flights to ${c.city}`, sub: 'Google Flights', color: '#e8612c', bg: '#fff7ed',
                                href: `https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI1LTAxLTAxagcIARIDJEpGcgcIARIDJkpG`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                                label: 'Long-term Stays', sub: 'Airbnb', color: '#ff385c', bg: '#fff1f2',
                                href: `https://www.airbnb.com/s/${encodeURIComponent(c.city)}/homes`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00aa6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                                label: `Things to do`, sub: 'Tripadvisor', color: '#00aa6c', bg: '#F0FAF4',
                                href: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(c.city)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
                                label: `Explore ${c.city}`, sub: 'Google Maps', color: '#4285f4', bg: '#eff6ff',
                                href: `https://www.google.com/maps/search/${encodeURIComponent(c.city)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                                label: 'Cost of Living', sub: 'Numbeo', color: '#52B788', bg: '#F0FAF4',
                                href: `https://www.numbeo.com/cost-of-living/in/${encodeURIComponent(c.city.replace(/ /g, '-'))}`
                            },
                        ].map(link => (
                            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', backgroundColor: link.bg, borderRadius: '0.875rem', textDecoration: 'none', color: '#0f172a', border: `1px solid ${link.color}22` }}>
                                <div style={{ flexShrink: 0 }}>{link.svg}</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f172a' }}>{link.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: link.color, fontWeight: 600, marginTop: '1px' }}>{link.sub}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* THINGS TO DO */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Things to do in {c.city}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Tours, experiences and activities curated for travelers</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                        {/* GetYourGuide */}
                        <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(c.city)}&searchSource=1&partner_id=VVPTRVK`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#fff8f0', border: '2px solid #F7831E22', borderRadius: '0.875rem', textDecoration: 'none' }}>
                            <div style={{ width: '44px', height: '44px', backgroundColor: '#F7831E', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>Tours & Experiences</div>
                                <div style={{ fontSize: '0.75rem', color: '#F7831E', fontWeight: 700, marginTop: '2px' }}>via GetYourGuide</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>Skip-the-line, day trips & more</div>
                            </div>
                        </a>

                        {/* Viator */}
                        <a href={`https://www.viator.com/search/${encodeURIComponent(c.city)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#F0FAF4', border: '2px solid #52B78822', borderRadius: '0.875rem', textDecoration: 'none' }}>
                            <div style={{ width: '44px', height: '44px', backgroundColor: '#52B788', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>Activities & Attractions</div>
                                <div style={{ fontSize: '0.75rem', color: '#52B788', fontWeight: 700, marginTop: '2px' }}>via Viator</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>Powered by Tripadvisor</div>
                            </div>
                        </a>

                        {/* Klook */}
                        <a href={`https://affiliate.klook.com/redirect?aid=119390&k_site=${encodeURIComponent('https://www.klook.com/s/' + c.city)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#fff8f0', border: '2px solid #F7831E22', borderRadius: '0.875rem', textDecoration: 'none' }}>
                            <div style={{ width: '44px', height: '44px', backgroundColor: '#F7831E', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>Tours & Experiences</div>
                                <div style={{ fontSize: '0.75rem', color: '#F7831E', fontWeight: 700, marginTop: '2px' }}>via Klook</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>Skip-the-line & more</div>
                            </div>
                        </a>
                    </div>

                    {/* Category quick links */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['Walking Tours', 'Food Tours', 'Day Trips', 'Museums', 'Night Life', 'Outdoor'].map(cat => (
                            <a key={cat}
                                href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(cat + ' ' + c.city)}&searchSource=1&partner_id=VVPTRVK`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '0.75rem', fontWeight: 700, color: '#52B788', backgroundColor: '#F0FAF4', border: '1px solid #D8F3DC', borderRadius: '2rem', padding: '0.3rem 0.75rem', textDecoration: 'none' }}>
                                {cat}
                            </a>
                        ))}
                    </div>
                </div>

                {related && related.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Other cities in {c.country}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {related.map(rc => <CityCard key={rc.slug} city={rc} preloadedImage={relatedImages[rc.slug]} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

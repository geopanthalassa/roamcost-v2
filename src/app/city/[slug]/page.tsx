// SERVER COMPONENT - Google indexa todo
import { supabase } from '@/lib/supabase';
import { getCityImageServer } from '@/lib/getCityImageServer';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import WeatherWidget from '@/components/WeatherWidget';
import CostPersonalizer from '@/components/CostPersonalizer';

interface CityPageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: CityPageProps) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country, cost_index, rent_usd, safety').eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!data) return { title: 'City Not Found | RoamCost' };
    const d = data as { city: string; country: string; cost_index: number; rent_index: number; safety: number };
    const title = `Cost of Living in ${d.city}, ${d.country} 2026 | RoamCost`;
    const description = `Move to ${d.city}? Compare rent ($${Math.round((d as any).rent_usd ?? d.rent_index ?? 0)}/mo), food, safety (${d.safety}/10) and quality of life. Real data for digital nomads, expats and travelers.`;
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
        .from('cities_master').select('*, rent_usd, food_usd, transport_usd, total_usd')
        .eq('slug', slug)
        .order('cost_index', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!data) notFound();
    const c = data as unknown as City;

    const hasData = (c.cost_index ?? 0) > 0;
    const heroImage = await getCityImageServer(c.slug, c.city, c.country, 1400);

    const { data: related } = await supabase
        .from('cities_master').select('*, rent_usd, food_usd, transport_usd, total_usd')
        .eq('country', c.country)
        .neq('slug', slug)
        .gt('cost_index', 0)
        .order('population', { ascending: false })
        .limit(3) as unknown as { data: City[] };

    const rent      = (c as any).rent_usd      ?? (c.rent_index ?? 0);
    const food      = (c as any).food_usd      ?? ((c.food_index ?? 0) * 30);
    const transport = (c as any).transport_usd ?? (c.transport_index ?? 0);
    const utilities = (c as any).total_usd ? Math.round((c as any).total_usd - ((c as any).rent_usd ?? 0) - ((c as any).food_usd ?? 0) - ((c as any).transport_usd ?? 0)) : (c.utilities_index ?? 0);
    const monthly   = (c as any).total_usd ? Math.round((c as any).total_usd) : Math.round(rent + food + transport + utilities);

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
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"0.3rem"}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Travel destination
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

                        {/* Descriptive paragraph for SEO and AdSense */}
                        {hasData && (
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', lineHeight: 1.75 }}>
                                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0 }}>
                                    <strong style={{ color: '#0f172a' }}>{c.city}</strong> is one of the {(c.cost_index ?? 0) < 50 ? 'most affordable' : (c.cost_index ?? 0) < 80 ? 'moderately priced' : 'higher-cost'} cities in {c.country} for expats and digital nomads.
                                    {' '}Monthly rent for a 1-bedroom apartment averages <strong>${Math.round((c as any).rent_usd ?? c.rent_index ?? 0).toLocaleString()}</strong>, making it {(c.rent_index ?? 0) < 600 ? 'very accessible for remote workers on a budget' : (c.rent_index ?? 0) < 1200 ? 'competitive compared to major Western cities' : 'a premium destination with high living standards'}.
                                    {' '}{c.city} scores <strong>{c.safety ?? 'N/A'}/10 on safety</strong> and offers <strong>{c.internet ?? 'N/A'} Mbps</strong> average internet speed{(c.internet ?? 0) >= 50 ? ' "” excellent for remote work' : (c.internet ?? 0) >= 20 ? ' "” suitable for most remote work needs' : ''}.
                                    {' '}Whether you are planning a short stay or a long-term relocation, {c.city} offers a {(c.cost_index ?? 0) < 60 ? 'low cost of living with strong quality of life indicators' : 'well-rounded lifestyle with access to international amenities'}.
                                </p>
                            </div>
                        )}

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
                                                    {m.value != null ? m.value : '"”'}{m.unit ? ` ${m.unit}` : ''}
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

                {/* TRAVEL "” always visible */}
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
                                href: `https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959&ued=${encodeURIComponent('https://www.booking.com/searchresults.html?ss=' + c.city + ', ' + c.country)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.41 16z"/></svg>,
                                label: `Flights to ${c.city}`, sub: 'Booking.com', color: '#003580', bg: '#eff6ff',
                                href: `https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959&ued=${encodeURIComponent('https://www.booking.com/flights/index.en-us.html?to=' + c.city)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                                label: `Car Rental in ${c.city}`, sub: 'Booking.com', color: '#003580', bg: '#eff6ff',
                                href: `https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959&ued=${encodeURIComponent('https://www.booking.com/cars/index.en-us.html?pickup_city=' + c.city)}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4046CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                                label: `Stay secure in ${c.city}`, sub: 'NordVPN', color: '#4046CA', bg: '#f0f0ff',
                                href: `https://www.awin1.com/cread.php?awinmid=15132&awinaffid=2865959&ued=https%3A%2F%2Fnordvpn.com`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e83e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                                label: `Compare Hotels`, sub: 'Trivago', color: '#e83e3e', bg: '#fff1f1',
                                href: `https://www.awin1.com/cread.php?awinmid=105929&awinaffid=2865959&ued=${encodeURIComponent('https://www.trivago.com/en-US/srl/hotels?search=200-' + encodeURIComponent(c.city))}`
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
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                                label: `Rent a Car in ${c.city}`, sub: 'RentalCars', color: '#1a56db', bg: '#eff6ff',
                                href: `https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959&ued=${encodeURIComponent('https://www.rentalcars.com/en/search/?pickUpName=' + encodeURIComponent(c.city) + '&dropOffName=' + encodeURIComponent(c.city))}`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                                label: `Tours in ${c.city}`, sub: 'GetYourGuide', color: '#F7831E', bg: '#fff8f0',
                                href: `https://www.getyourguide.com/s/?q=${encodeURIComponent(c.city)}&searchSource=1&partner_id=VVPTRVK`
                            },
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                                label: `Activities in ${c.city}`, sub: 'Klook', color: '#FF6B35', bg: '#fff5f0',
                                href: `https://affiliate.klook.com/redirect?aid=119390&k_site=${encodeURIComponent('https://www.klook.com/s/' + c.city)}`
                            },
                        
                            {
                                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                                label: `Send money to ${c.city}`, sub: 'Wise', color: '#00B9FF', bg: '#f0fbff',
                                href: `https://wise.prf.hn/click/camref:1110lFqtW`
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

                {/* PLAN YOUR MOVE "” contextual CTA with real rent price */}
                {((c as any).rent_usd ?? c.rent_index ?? 0) > 0 && (
                    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.15)' }} />
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Ready to make the move?</div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                                Plan your life in {c.city}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                                Average rent is <strong style={{ color: 'white' }}>${Math.round((c as any).rent_usd ?? c.rent_index ?? 0).toLocaleString()}/mo</strong>. 
                                Find your accommodation, explore the city, and get there first.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <a href={`https://www.awin1.com/cread.php?awinmid=105929&awinaffid=2865959&ued=${encodeURIComponent('https://www.trivago.com/en-US/srl/hotels?search=200-' + encodeURIComponent(c.city))}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ backgroundColor: '#52B788', color: 'white', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                    Find accommodation
                                </a>
                                <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(c.city)}&searchSource=1&partner_id=VVPTRVK`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                    Explore the city
                                </a>
                                <a href={`https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959&ued=${encodeURIComponent('https://www.rentalcars.com/en/search/?pickUpName=' + encodeURIComponent(c.city) + '&dropOffName=' + encodeURIComponent(c.city))}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    Rent a car
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {related && related.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Other cities in {c.country}</h2>
                        <div className="related-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {related.map(rc => <CityCard key={rc.slug} city={rc} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}






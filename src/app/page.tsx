import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';

export const revalidate = 3600;

const POPULAR_COMPARISONS = [
    { a: 'paris', b: 'london', labelA: 'Paris', labelB: 'London' },
    { a: 'tokyo', b: 'seoul', labelA: 'Tokyo', labelB: 'Seoul' },
    { a: 'barcelona', b: 'lisbon', labelA: 'Barcelona', labelB: 'Lisbon' },
    { a: 'new-york', b: 'london', labelA: 'New York', labelB: 'London' },
    { a: 'bangkok', b: 'singapore', labelA: 'Bangkok', labelB: 'Singapore' },
    { a: 'berlin', b: 'amsterdam', labelA: 'Berlin', labelB: 'Amsterdam' },
    { a: 'buenos-aires', b: 'bogota', labelA: 'Buenos Aires', labelB: 'Bogotá' },
    { a: 'dubai', b: 'singapore', labelA: 'Dubai', labelB: 'Singapore' },
];

const RANKING_LINKS = [
    { href: '/rankings/cheapest', label: 'Cheapest Cities in Europe' },
    { href: '/rankings/cheapest', label: 'Cheapest Cities in Asia' },
    { href: '/rankings/cheapest', label: 'Cheapest Cities in Latin America' },
    { href: '/rankings/nomads', label: 'Best Cities for Digital Nomads' },
    { href: '/rankings/safest', label: 'Safest Cities in the World' },
    { href: '/rankings/quality', label: 'Highest Quality of Life' },
];

// Hardcoded popular city slugs to guarantee well-known cities appear
const POPULAR_CITY_SLUGS = [
    'new-york', 'london', 'paris', 'tokyo',
    'barcelona', 'berlin', 'singapore', 'dubai',
    'amsterdam', 'lisbon', 'bangkok', 'sydney',
];

const CURRENCY_MAP: Record<string, string> = {
    'United States': 'USD', 'United Kingdom': 'GBP', 'France': 'EUR',
    'Japan': 'JPY', 'Spain': 'EUR', 'Germany': 'EUR', 'Singapore': 'SGD',
    'United Arab Emirates': 'AED', 'Netherlands': 'EUR', 'Portugal': 'EUR',
    'Thailand': 'THB', 'Australia': 'AUD', 'Canada': 'CAD', 'Brazil': 'BRL',
    'Argentina': 'ARS', 'Mexico': 'MXN', 'Colombia': 'COP', 'Chile': 'CLP',
};

export default async function Home() {
    // Fetch popular cities by slug
    const { data: popularCities } = await supabase
        .from('cities_master')
        .select('*')
        .in('slug', POPULAR_CITY_SLUGS) as unknown as { data: City[] };

    // Sort to match our preferred order
    const sortedPopular = POPULAR_CITY_SLUGS
        .map(slug => popularCities?.find(c => c.slug === slug))
        .filter(Boolean) as City[];

    const { data: cheapestCities } = await supabase
        .from('cities_master')
        .select('*')
        .gt('cost_index', 0)
        .gt('population', 2000000)
        .order('rent_index', { ascending: true })
        .limit(4) as unknown as { data: City[] };

    const { data: nomadCities } = await supabase
        .from('cities_master')
        .select('*')
        .gt('cost_index', 0)
        .gt('population', 2000000)
        .order('internet', { ascending: false })
        .limit(4) as unknown as { data: City[] };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* ── HERO ── */}
            <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
                    <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>

                        {/* Eyebrow */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2rem', padding: '0.35rem 1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b8c71' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Global Cost of Living Data
                            </span>
                        </div>

                        <h1 style={{ fontSize: '3.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
                            Compare the{' '}
                            <span style={{ color: '#5b8c71' }}>cost of living</span>
                            {' '}between any two cities
                        </h1>

                        <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
                            Rent, food, safety, internet speed and quality of life — all in one place.
                            Make informed decisions about where to live, work or travel.
                        </p>

                        {/* Search */}
                        <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                            <SearchBar />
                        </div>

                        {/* Quick links */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Tokyo', 'Paris', 'Barcelona', 'Dubai', 'Bangkok', 'Berlin'].map(city => (
                                <Link key={city} href={`/city/${city.toLowerCase()}`}
                                    style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', backgroundColor: '#f1f5f9', padding: '0.4rem 0.875rem', borderRadius: '2rem', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                                    {city}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section style={{ backgroundColor: '#0f172a', padding: '1.75rem 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', textAlign: 'center' }}>
                        {[
                            { value: '45,000+', label: 'Cities covered' },
                            { value: '4,000+', label: 'With full cost data' },
                            { value: '180+', label: 'Countries' },
                            { value: 'Free', label: 'Always' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ padding: '0.5rem 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#5b8c71' }}>{s.value}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── POPULAR COMPARISONS ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Side-by-side analysis</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Comparisons</h2>
                            <Link href="/compare" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#5b8c71', textDecoration: 'none' }}>
                                Compare any city →
                            </Link>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
                        {POPULAR_COMPARISONS.map(({ a, b, labelA, labelB }) => (
                            <Link key={`${a}-${b}`} href={`/compare/${a}-vs-${b}`}
                                style={{ display: 'block', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s' }}
                               
                            >
                                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                                    {labelA} vs {labelB}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#5b8c71', margin: 0, fontWeight: 600 }}>Compare costs →</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── POPULAR CITIES ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Global hubs</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Cities</h2>
                            <Link href="/rankings/quality" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#5b8c71', textDecoration: 'none' }}>
                                View all rankings →
                            </Link>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {sortedPopular.map(city => {
                            const currency = CURRENCY_MAP[city.country] || 'USD';
                            const cost = city.cost_index > 0 ? Math.round(city.cost_index) : null;
                            const safety = city.safety > 0 ? Math.round(city.safety * 10) : null;
                            const climate = city.environment > 0 ? Math.round(city.environment * 10) : null;
                            return (
                                <Link key={city.slug} href={`/city/${city.slug}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
                                        borderRadius: '1rem', padding: '1.25rem',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{city.city}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>{city.country}</div>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5b8c71', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem', padding: '0.2rem 0.45rem' }}>
                                                {currency}
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                                            {[
                                                { label: 'Cost', value: cost },
                                                { label: 'Safety', value: safety },
                                                { label: 'Climate', value: climate },
                                            ].map(stat => (
                                                <div key={stat.label} style={{ padding: '0.5rem 0.25rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{stat.label}</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{stat.value ?? '—'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>How it works</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Data-driven decisions</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[
                            {
                                num: '01',
                                title: 'Search any city',
                                desc: 'Access data for over 45,000 cities worldwide including rent, food, transport, safety and internet speed.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                )
                            },
                            {
                                num: '02',
                                title: 'Compare side by side',
                                desc: 'Select any two cities and get a detailed breakdown of every cost category to make an informed comparison.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                    </svg>
                                )
                            },
                            {
                                num: '03',
                                title: 'Plan your move',
                                desc: 'Use our currency calculator and travel tools to plan your relocation or trip with real, up-to-date data.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                )
                            },
                        ].map(item => (
                            <div key={item.num} style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>{item.num}</span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CHEAPEST + NOMAD ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                        {/* Cheapest */}
                        <div>
                            <div style={{ marginBottom: '1.75rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Budget travel</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Most affordable cities</h2>
                                    <Link href="/rankings/cheapest" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textDecoration: 'none' }}>See all →</Link>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cheapestCities?.map((city, i) => {
                                    const monthly = Math.round(((city.rent_index ?? 0) * 10) + ((city.food_index ?? 0) * 5) + ((city.transport_index ?? 0) * 2) + ((city.utilities_index ?? 0) * 3));
                                    return (
                                        <Link key={city.slug} href={`/city/${city.slug}`}
                                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: '#ffffff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', minWidth: '20px' }}>#{i + 1}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{city.city}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{city.country}</div>
                                            </div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#5b8c71' }}>${monthly.toLocaleString()}/mo</div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nomad */}
                        <div>
                            <div style={{ marginBottom: '1.75rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Remote work</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Best for digital nomads</h2>
                                    <Link href="/rankings/nomads" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textDecoration: 'none' }}>See all →</Link>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {nomadCities?.map((city, i) => (
                                    <Link key={city.slug} href={`/city/${city.slug}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: '#ffffff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', minWidth: '20px' }}>#{i + 1}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>{city.city}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{city.country}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#8b5cf6' }}>{city.internet} Mbps</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>internet</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RANKINGS ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Rankings</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Explore by category</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {RANKING_LINKS.map(r => (
                            <Link key={r.href + r.label} href={r.href}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.875rem', textDecoration: 'none' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{r.label}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#0f172a' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Ready to find your next city?
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                        Compare costs, explore destinations and plan your next move with real data.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: '#5b8c71', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>
                            Compare cities
                        </Link>
                        <Link href="/rankings/quality" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                            View rankings
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

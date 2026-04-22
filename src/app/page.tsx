import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import WorldMap from '@/components/WorldMap';
import QuickConverter from '@/components/QuickConverter';
import ProfileFilter from '@/components/ProfileFilter';
import { supabase } from '@/lib/supabase';
import { getCityImage } from '@/lib/cityImages';
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

    // Map cities — well-known cities with lat/long
    const { data: mapCities } = await supabase
        .from('cities_master')
        .select('city, country, slug, lat, long, cost_index, rent_index')
        .gt('cost_index', 0)
        .gt('population', 1500000)
        .not('lat', 'is', null)
        .not('long', 'is', null)
        .limit(300) as unknown as { data: City[] };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* ── HERO ── */}
            <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
                    <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>

                        {/* Eyebrow */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdfc', border: '1px solid #b2f0ec', borderRadius: '2rem', padding: '0.35rem 1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2BC0B4' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Global Cost of Living Data
                            </span>
                        </div>

                        <h1 style={{ fontSize: '3.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
                            Compare the{' '}
                            <span style={{ color: '#2BC0B4' }}>cost of living</span>
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
                    <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', textAlign: 'center' }}>
                        {[
                            { value: '45,000+', label: 'Cities covered' },
                            { value: '4,000+', label: 'With full cost data' },
                            { value: '180+', label: 'Countries' },
                            { value: 'Free', label: 'Always' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ padding: '0.5rem 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2BC0B4' }}>{s.value}</div>
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
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Side-by-side analysis</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Comparisons</h2>
                            <Link href="/compare" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2BC0B4', textDecoration: 'none' }}>
                                Compare any city →
                            </Link>
                        </div>
                    </div>
                    <div className="rankings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
                        {POPULAR_COMPARISONS.map(({ a, b, labelA, labelB }) => (
                            <Link key={`${a}-${b}`} href={`/compare/${a}-vs-${b}`}
                                style={{ display: 'block', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s' }}
                               
                            >
                                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                                    {labelA} vs {labelB}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#2BC0B4', margin: 0, fontWeight: 600 }}>Compare costs →</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROFILE FILTER ── */}
            <ProfileFilter />

            {/* ── QUICK CONVERTER ── */}
            <QuickConverter />

            {/* ── POPULAR CITIES ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Global hubs</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Cities</h2>
                            <Link href="/rankings/quality" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2BC0B4', textDecoration: 'none' }}>
                                View all rankings →
                            </Link>
                        </div>
                    </div>
                    {/* Desktop grid / Mobile carousel */}
                    <div className="popular-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {sortedPopular.map(city => {
                            const currency = CURRENCY_MAP[city.country] || 'USD';
                            const cost = city.cost_index > 0 ? Math.round(city.cost_index) : null;
                            const safety = city.safety > 0 ? Math.round(city.safety * 10) : null;
                            const climate = city.environment > 0 ? Math.round(city.environment * 10) : null;
                            const imgQuery = encodeURIComponent(`${city.city} city`);
                            const seed = Math.abs(city.city.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % 1000;
                            const imgUrl = getCityImage(city.slug, 400, 200);
                            return (
                                <Link key={city.slug} href={`/city/${city.slug}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
                                        borderRadius: '1rem', overflow: 'hidden',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}>
                                        {/* City image */}
                                        <div style={{
                                            height: '120px',
                                            backgroundImage: `url(${imgUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: '#e2e8f0',
                                            position: 'relative',
                                        }}>
                                            {/* Gradient overlay */}
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)',
                                            }} />
                                            {/* Currency badge */}
                                            <span style={{
                                                position: 'absolute', top: '10px', right: '10px',
                                                fontSize: '0.65rem', fontWeight: 800, color: '#ffffff',
                                                backgroundColor: 'rgba(15,23,42,0.7)',
                                                borderRadius: '0.375rem', padding: '0.15rem 0.4rem',
                                                backdropFilter: 'blur(4px)',
                                            }}>
                                                {currency}
                                            </span>
                                            {/* City name on image */}
                                            <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>{city.city}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{city.country}</div>
                                            </div>
                                        </div>
                                        {/* Stats */}
                                        <div style={{ padding: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', textAlign: 'center' }}>
                                            {[
                                                {
                                                    label: 'Cost', value: cost,
                                                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                                },
                                                {
                                                    label: 'Safety', value: safety,
                                                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                                },
                                                {
                                                    label: 'Climate', value: climate,
                                                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                                                },
                                            ].map(stat => (
                                                <div key={stat.label} style={{ padding: '0.4rem 0.25rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem' }}>{stat.icon}</div>
                                                    <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.1rem' }}>{stat.label}</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{stat.value ?? '—'}</div>
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
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>How it works</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Data-driven decisions</h2>
                    </div>
                    <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[
                            {
                                num: '01',
                                title: 'Search any city',
                                desc: 'Access data for over 45,000 cities worldwide including rent, food, transport, safety and internet speed.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2BC0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                )
                            },
                            {
                                num: '02',
                                title: 'Compare side by side',
                                desc: 'Select any two cities and get a detailed breakdown of every cost category to make an informed comparison.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2BC0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                    </svg>
                                )
                            },
                            {
                                num: '03',
                                title: 'Plan your move',
                                desc: 'Use our currency calculator and travel tools to plan your relocation or trip with real, up-to-date data.',
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2BC0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                )
                            },
                        ].map(item => (
                            <div key={item.num} style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdfc', border: '1px solid #b2f0ec', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

            {/* ── WORLD MAP ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Interactive</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
                                Cost of living — world map
                            </h2>
                            <Link href="/rankings/cheapest" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2BC0B4', textDecoration: 'none' }}>
                                See rankings →
                            </Link>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Click any city to explore costs. Colors indicate affordability.
                        </p>
                    </div>
                    <WorldMap cities={(mapCities ?? []) as any} />
                </div>
            </section>

            {/* ── RANKINGS ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2BC0B4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Rankings</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Explore by category</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {RANKING_LINKS.map(r => (
                            <Link key={r.href + r.label} href={r.href}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.875rem', textDecoration: 'none' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{r.label}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2BC0B4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                        <Link href="/compare" style={{ backgroundColor: '#2BC0B4', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>
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

import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import WorldMap from '@/components/WorldMap';
import QuickConverter from '@/components/QuickConverter';
import ProfileFilter from '@/components/ProfileFilter';
import { supabase } from '@/lib/supabase';
import { getCityImage } from '@/lib/cityImages';
import { City } from '@/types/database';

export const revalidate = 60;

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
        .in('slug', POPULAR_CITY_SLUGS)
        .order('population', { ascending: false }) as unknown as { data: City[] };

    // For each slug, pick the city with highest population (avoid small towns)
    const seenSlugs = new Set<string>();
    const sortedPopular = POPULAR_CITY_SLUGS
        .map(slug => {
            const city = popularCities?.find(c => c.slug === slug && !seenSlugs.has(c.slug));
            if (city) seenSlugs.add(city.slug);
            return city;
        })
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

    // Map cities – well-known cities with lat/long
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

            {/* â"€â"€ HERO WITH VIDEO â"€â"€ */}
            

            
            {/* AFFILIATES BAR */}
            <section style={{ padding: '1.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div className="affiliates-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
                        {[
                            {
                                href: 'https://wise.prf.hn/click/camref:1110lFqtW',
                                bg: '#e8fcd4', color: '#3d7a0a',
                                name: 'Wise', desc: 'Send money abroad',
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3d7a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            },
                            {
                                href: `https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959&ued=https%3A%2F%2Fwww.booking.com`,
                                bg: '#e8eeff', color: '#003580',
                                name: 'Booking.com', desc: 'Hotels & stays',
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#003580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            },
                            {
                                href: `https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959&ued=https%3A%2F%2Fwww.rentalcars.com`,
                                bg: '#fff0e8', color: '#d45500',
                                name: 'RentalCars', desc: 'Car rental worldwide',
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d45500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            },
                            {
                                href: 'https://www.getyourguide.com/?partner_id=VVPTRVK',
                                bg: '#fff3f0', color: '#cc3300',
                                name: 'GetYourGuide', desc: 'Tours & experiences',
                                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cc3300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                            },
                        ].map(item => (
                            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem',
                                    backgroundColor: item.bg, borderRadius: '0.875rem',
                                    border: `1px solid ${item.color}22`, textDecoration: 'none' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem',
                                    backgroundColor: 'white', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', flexShrink: 0,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginTop: '0.1rem' }}>{item.desc}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '3rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Blog</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Cost of living guides</h2>
                            <a href="/blog" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52B788', textDecoration: 'none' }}>See all →</a>
                        </div>
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { href: '/blog/cheapest-cities-europe-2026', title: 'Cheapest Cities in Europe 2026', desc: 'The most affordable European cities with real cost data.', category: 'Europe', img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&h=300&q=80' },
                            { href: '/blog/best-cities-digital-nomads-2026', title: 'Best Cities for Digital Nomads', desc: 'Fast internet, affordable rent and great communities.', category: 'Nomads', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&h=300&q=80' },
                            { href: '/blog/internet-speed-cities-digital-nomads-2026', title: 'Best Cities for Internet Speed', desc: 'Fast internet cities that are actually affordable.', category: 'Remote Work', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&h=300&q=80' },
                        ].map((post) => (
                            <a key={post.href} href={post.href} style={{ display: 'block', borderRadius: '1rem', textDecoration: 'none', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <img src={post.img} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                                <div style={{ padding: '1.25rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: '#F0FAF4', padding: '0.2rem 0.6rem', borderRadius: '2rem', display: 'inline-block', marginBottom: '0.5rem' }}>{post.category}</span>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem', lineHeight: 1.3, wordBreak: 'keep-all', hyphens: 'none' }}>{post.title}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{post.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            

            {/* â"€â"€ STATS BAR â"€â"€ */}
            
            {/* â"€â"€ POPULAR COMPARISONS â"€â"€ */}
            <section style={{ backgroundColor: '#0f172a', padding: '1.75rem 0', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', textAlign: 'center' }}>
                        {[
                            { value: '45,000+', label: 'Cities covered' },
                            { value: '4,000+', label: 'With full cost data' },
                            { value: '180+', label: 'Countries' },
                            { value: 'Free', label: 'Always' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ padding: '0.5rem 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#52B788' }}>{s.value}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Side-by-side analysis</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Comparisons</h2>
                            <Link href="/compare" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52B788', textDecoration: 'none' }}>
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
                                <p style={{ fontSize: '0.75rem', color: '#52B788', margin: 0, fontWeight: 600 }}>Compare costs →</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* â"€â"€ POPULAR CITIES â"€â"€ */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Global hubs</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Popular Cities</h2>
                        </div>
                        <Link href="/rankings/quality" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52B788', textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
                            View all rankings →
                        </Link>
                    </div>
                    {/* Desktop grid / Mobile carousel */}
                    <div className="popular-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {sortedPopular.map(city => {
                            const currency = CURRENCY_MAP[city.country] || 'USD';
                            const cost = city.cost_index > 0 ? Math.round(city.cost_index) : null;
                            const safety = city.safety > 0 ? Math.round(city.safety * 10) : null;
                            const climate = city.environment > 0 ? Math.round(city.environment * 10) : null;
                            const imgUrl = getCityImage(city.slug, 400, 200, city.city);
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
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{stat.value ?? '–'}</div>
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

            {/* â"€â"€ HOW IT WORKS â"€â"€ */}
            

            {/* â"€â"€ WORLD MAP â"€â"€ */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Interactive</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
                                Cost of living – world map
                            </h2>
                        </div>
                        <Link href="/rankings/cheapest" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52B788', textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
                            See rankings →
                        </Link>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Click any city to explore costs. Colors indicate affordability.
                        </p>
                    </div>
                    <WorldMap cities={(mapCities ?? []) as any} />
                </div>
            </section>

            {/* â"€â"€ RANKINGS â"€â"€ */}
            <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Rankings</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Explore by category</h2>
                    </div>
                    <div className="rankings-categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {RANKING_LINKS.map(r => (
                            <Link key={r.href + r.label} href={r.href}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.875rem', textDecoration: 'none' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word' }}>{r.label}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* â"€â"€ CTA â"€â"€ */}
            <section style={{ padding: '5rem 0', backgroundColor: '#0f172a' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Ready to find your next city?
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                        Compare costs, explore destinations and plan your next move with real data.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: '#52B788', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>
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

 









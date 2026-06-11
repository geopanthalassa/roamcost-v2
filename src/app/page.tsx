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
            <section style={{ position: 'relative', overflow: 'hidden', minHeight: '620px', display: 'flex', alignItems: 'center', backgroundColor: '#0f172a' }}>
                {/* Video background */}
                      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "RoamCost - Compare Cost of Living Between Cities Worldwide",
        "description": "Compare rent, food, safety and quality of life between hundreds of cities worldwide. Free data for digital nomads, expats and travelers.",
        "thumbnailUrl": "https://www.roamcost.com/og-image.jpg",
        "uploadDate": "2026-01-01T00:00:00+00:00",
        "contentUrl": "https://www.roamcost.com/world-cup-hero-v2.mp4",
        "embedUrl": "https://www.roamcost.com",
        "publisher": { "@type": "Organization", "name": "RoamCost", "url": "https://www.roamcost.com" }
      }) }} />
            <video
                    autoPlay muted loop playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
                >
                    <source src="/world-cup-hero-v2.mp4" type="video/mp4" />
                </video>
                {/* Gradient overlay - lighter to show more video */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.35) 100%)' }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 5rem', width: '100%' }}>
                    <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>

                        {/* Eyebrow */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(82,183,136,0.15)', border: '1px solid rgba(82,183,136,0.4)', borderRadius: '2rem', padding: '0.35rem 1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#52B788' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Global Cost of Living Data
                            </span>
                        </div>

                        <h1 style={{ fontSize: '3.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
                            Compare the{' '}
                            <span style={{ color: '#52B788' }}>cost of living</span>
                            {' '}across the world
                        </h1>

                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
                            Rent, food, safety, internet speed and quality of life – all in one place.
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
                                    style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.875rem', borderRadius: '2rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    {city}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WORLD CUP 2026 */}
            <section style={{ padding: '2.5rem 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', textAlign: 'center' }}>Plan your trip</p>
                    <div className="affiliates-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {[
                            {
                                href: 'https://wise.prf.hn/click/camref:1110lFqtW',
                                bg: '#e8fcd4', border: '#9FE870', iconColor: '#5a9e2f',
                                label: 'Send money abroad',
                                sub: 'Wise',
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a9e2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            },
                            {
                                href: `https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959&ued=https%3A%2F%2Fwww.booking.com`,
                                bg: '#e8eeff', border: '#003580', iconColor: '#003580',
                                label: 'Find your hotel',
                                sub: 'Booking.com',
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            },
                            {
                                href: `https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959&ued=https%3A%2F%2Fwww.rentalcars.com`,
                                bg: '#fff0e8', border: '#FF6600', iconColor: '#FF6600',
                                label: 'Rent a car',
                                sub: 'RentalCars',
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            },
                            {
                                href: 'https://www.getyourguide.com/?partner_id=VVPTRVK',
                                bg: '#fff3f0', border: '#FF5533', iconColor: '#FF5533',
                                label: 'Book experiences',
                                sub: 'GetYourGuide',
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                            },
                        ].map(item => (
                            <a key={item.sub} href={item.href} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem',
                                    backgroundColor: item.bg, borderRadius: '1rem',
                                    border: `1.5px solid ${item.border}33`,
                                    textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s' }}>
                                <div style={{ flexShrink: 0, width: '52px', height: '52px', borderRadius: '0.875rem',
                                    backgroundColor: 'white', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 900, color: item.iconColor, letterSpacing: '-0.01em' }}>{item.sub}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>{item.label}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            {/* HOT TAKES PREVIEW */}
            <section style={{ padding: '3rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Blog</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Cost of living guides</h2>
                            <a href="/blog" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52B788', textDecoration: 'none' }}>See all →</a>
                        </div>
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { href: '/blog/world-cup-2026-travel-guide', title: 'FIFA World Cup 2026 Travel Guide', desc: 'Costs, hotels and tips for all 16 host cities.', category: 'World Cup 2026', img: '/cities/world-cup-travel.jpg' },
                            { href: '/blog/cheapest-world-cup-2026-cities', title: 'Cheapest World Cup 2026 Cities', desc: 'Which host city is cheapest? Full cost comparison.', category: 'World Cup 2026', img: '/cities/world-cup-cities.jpg' },
                            { href: '/blog/world-cup-2026-currency-guide', title: 'World Cup 2026 Currency Guide', desc: 'Exchange USD, MXN and CAD — save money on every transaction.', category: 'World Cup 2026', img: '/cities/world-cup-currency.jpg' },
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
            


            <section style={{ padding: '3rem 0', backgroundColor: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F7831E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Hot Takes</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>City comparisons that will surprise you</h2>
                            <a href="/hot-takes" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F7831E', textDecoration: 'none' }}>See all →</a>
                        </div>
                    <div className="hot-takes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { href: '/hot-takes/bangkok-vs-bali', title: 'Bangkok vs Bali', desc: 'Which is cheaper for long-term living? The answer might surprise you.', tag: 'Asia', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&h=300&q=80' },
                            { href: '/hot-takes/new-york-vs-mexico-city', title: 'New York vs Mexico City', desc: 'Same continent, completely different cost reality.', tag: 'Americas', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&h=300&q=80' },
                            { href: '/hot-takes/lisbon-vs-barcelona', title: 'Lisbon vs Barcelona', desc: 'Two Iberian gems — but only one fits a $2,000 budget.', tag: 'Europe', img: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=600&h=300&q=80' },
                        ].map((item) => (
                            <a key={item.href} href={item.href} style={{ display: 'block', borderRadius: '1rem', textDecoration: 'none', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
                                <img src={item.img} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F7831E', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '2rem', display: 'inline-block', marginBottom: '0.5rem' }}>{item.tag}</span>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'white', margin: '0 0 0.25rem', wordBreak: 'keep-all', overflowWrap: 'break-word', hyphens: 'none' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>



            

            <section style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem 0',
                background: 'linear-gradient(160deg, #0d1b2a 0%, #1a0a2e 30%, #0a2010 60%, #1a0a0a 100%)' }}>
                <style>{`
                    @keyframes wcBounce{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(180deg)}}
                    @keyframes wcWave{0%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}100%{transform:rotate(-8deg)}}
                    @keyframes wcStreak{0%{left:-80px;opacity:0}20%{opacity:0.8}80%{opacity:0.8}100%{left:calc(100% + 80px);opacity:0}}
                    @keyframes wcPulse{0%,100%{opacity:0.5}50%{opacity:1}}
                    .wc-ball{animation:wcBounce 2s ease-in-out infinite;display:inline-block}
                    .wc-ball-2{animation:wcBounce 2s ease-in-out infinite;animation-delay:0.4s;display:inline-block}
                    .wc-ball-3{animation:wcBounce 2s ease-in-out infinite;animation-delay:0.8s;display:inline-block}
                    .wc-flag{animation:wcWave 1.5s ease-in-out infinite;transform-origin:left center;display:inline-block}
                    .wc-flag-2{animation:wcWave 1.5s ease-in-out infinite;animation-delay:0.3s;transform-origin:left center;display:inline-block}
                    .wc-flag-3{animation:wcWave 1.5s ease-in-out infinite;animation-delay:0.6s;transform-origin:left center;display:inline-block}
                    .wc-s1{position:absolute;height:3px;width:80px;border-radius:2px;background:linear-gradient(90deg,transparent,#FFD700,transparent);top:25%;animation:wcStreak 2.5s linear infinite}
                    .wc-s2{position:absolute;height:2px;width:60px;border-radius:2px;background:linear-gradient(90deg,transparent,#52B788,transparent);top:55%;animation:wcStreak 3s linear infinite;animation-delay:1s}
                    .wc-s3{position:absolute;height:2px;width:70px;border-radius:2px;background:linear-gradient(90deg,transparent,#E63946,transparent);top:75%;animation:wcStreak 2.8s linear infinite;animation-delay:2s}
                    .wc-s4{position:absolute;height:2px;width:50px;border-radius:2px;background:linear-gradient(90deg,transparent,#ffffff,transparent);top:40%;animation:wcStreak 3.5s linear infinite;animation-delay:0.5s}
                    .wc-card{transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;position:relative;overflow:hidden}
                    .wc-card:hover{transform:translateY(-4px) scale(1.02)}
                    @media(max-width:640px){.wc-cities-grid{grid-template-columns:repeat(2,1fr)!important}.wc-affiliates-grid{grid-template-columns:repeat(2,1fr)!important}}
                `}</style>
                <div className="wc-s1"/><div className="wc-s2"/><div className="wc-s3"/><div className="wc-s4"/>

                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem', position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                            <div>
                                <span className="wc-ball" style={{ fontSize:'1.6rem' }}>⚽</span>
                                <span className="wc-ball-2" style={{ fontSize:'1.1rem' }}>⚽</span>
                                <span className="wc-ball-3" style={{ fontSize:'1.3rem' }}>⚽</span>
                            </div>
                            <div>
                                <div style={{ fontSize:'0.65rem', fontWeight:800, color:'#FFD700', textTransform:'uppercase', letterSpacing:'0.15em' }}>FIFA World Cup</div>
                                <div style={{ fontSize:'1.75rem', fontWeight:900, color:'#ffffff', letterSpacing:'-0.03em', lineHeight:1.1 }}>2026 Travel Guide</div>
                            </div>
                        </div>
                        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                            <span className="wc-flag" style={{ fontSize:'1.75rem' }}>🇺🇸</span>
                            <span className="wc-flag-2" style={{ fontSize:'1.75rem' }}>🇲🇽</span>
                            <span className="wc-flag-3" style={{ fontSize:'1.75rem' }}>🇨🇦</span>
                        </div>
                    </div>

                    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
                        {[['⚽ 48 teams','#FFD700','rgba(255,215,0,0.15)'],['🏟️ 104 matches','#52B788','rgba(82,183,136,0.15)'],['🌎 16 host cities','rgba(255,255,255,0.9)','rgba(255,255,255,0.1)'],['🏆 3 countries','#E63946','rgba(230,57,70,0.15)']].map(([label,color,bg]) => (
                            <span key={label} style={{ background:bg, border:`1px solid ${color}55`, color, fontSize:'0.75rem', fontWeight:700, padding:'4px 12px', borderRadius:'20px' }}>{label}</span>
                        ))}
                    </div>

                    <div className="wc-cities-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.625rem', marginBottom:'1rem' }}>
                        {[
                            { city:'New York', flag:'🇺🇸', cost:'$$$$$', budget:'$2,800/wk', slug:'new-york', img:'photo-1496442226666-8d4d0e62e6e9', border:'rgba(60,120,255,0.6)' },
                            { city:'Los Angeles', flag:'🇺🇸', cost:'$$$$', budget:'$2,200/wk', slug:'los-angeles', img:'photo-1534190760961-74e8c1c5c3da', border:'rgba(60,120,255,0.5)' },
                            { city:'Miami', flag:'🇺🇸', cost:'$$$$', budget:'$1,680/wk', slug:'miami', img:'photo-1506905925346-21bda4d32df4', border:'rgba(60,120,255,0.5)' },
                            { city:'Dallas', flag:'🇺🇸', cost:'$$$', budget:'$1,295/wk', slug:'dallas', img:'photo-1534190760961-74e8c1c5c3da', border:'rgba(60,120,255,0.4)' },
                            { city:'Houston', flag:'🇺🇸', cost:'$$$', budget:'$1,365/wk', slug:'houston-united-states', img:'photo-1507699622108-4be3abd695ad', border:'rgba(60,120,255,0.4)' },
                            { city:'Seattle', flag:'🇺🇸', cost:'$$$', budget:'$1,500/wk', slug:'seattle-united-states', img:'photo-1577948000111-9c970dfe3743', border:'rgba(60,120,255,0.4)' },
                            { city:'San Francisco', flag:'🇺🇸', cost:'$$$$', budget:'$2,100/wk', slug:'san-francisco-united-states', img:'photo-1501594907352-04cda38ebc29', border:'rgba(60,120,255,0.5)' },
                            { city:'Boston', flag:'🇺🇸', cost:'$$$', budget:'$1,600/wk', slug:'boston-united-states', img:'photo-1524231757912-21f4fe3a7200', border:'rgba(60,120,255,0.4)' },
                            { city:'Kansas City', flag:'🇺🇸', cost:'$$', budget:'$1,190/wk', slug:'kansas-city-united-states', img:'photo-1500534314209-a25ddb2bd429', border:'rgba(82,183,136,0.7)' },
                            { city:'Philadelphia', flag:'🇺🇸', cost:'$$$', budget:'$1,500/wk', slug:'philadelphia-united-states', img:'photo-1569761316261-9a8696fa2ca3', border:'rgba(60,120,255,0.4)' },
                            { city:'Mexico City', flag:'🇲🇽', cost:'$', budget:'$840/wk', slug:'mexico-city', img:'photo-1518105779142-d975f22f1b0a', border:'rgba(0,180,0,0.7)' },
                            { city:'Guadalajara', flag:'🇲🇽', cost:'$', budget:'$750/wk', slug:'guadalajara-mexico', img:'photo-1596422846543-75c6fc197f07', border:'rgba(0,180,0,0.6)' },
                            { city:'Monterrey', flag:'🇲🇽', cost:'$', budget:'$780/wk', slug:'monterrey-mexico', img:'photo-1518105779142-d975f22f1b0a', border:'rgba(0,180,0,0.6)' },
                            { city:'Toronto', flag:'🇨🇦', cost:'$$$', budget:'$1,600/wk', slug:'toronto-canada', img:'photo-1517935706615-2717063c2225', border:'rgba(230,57,70,0.6)' },
                            { city:'Vancouver', flag:'🇨🇦', cost:'$$$$', budget:'$1,900/wk', slug:'vancouver-canada', img:'photo-1477959858617-67f85cf4f1df', border:'rgba(230,57,70,0.5)' },
                        ].map(item => (
                            <a key={item.slug} href={`/city/${item.slug}`} className="wc-card"
                                style={{ borderRadius:'0.75rem', textDecoration:'none', display:'block',
                                    border:`1.5px solid ${item.border}`,
                                    background:`linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.65)), url(https://images.unsplash.com/${item.img}?auto=format&fit=crop&w=300&h=200&q=60) center/cover`,
                                    minHeight:'100px' }}>
                                <div style={{ padding:'0.75rem', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100px' }}>
                                    <div style={{ fontSize:'1.5rem', marginBottom:'0.15rem', filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}>{item.flag}</div>
                                    <div style={{ fontSize:'0.8rem', fontWeight:900, color:'#ffffff', lineHeight:1.2, marginBottom:'0.2rem', textShadow:'0 1px 3px rgba(0,0,0,0.8)' }}>{item.city}</div>
                                    <div style={{ fontSize:'0.65rem', color:'#FFD700', fontWeight:800 }}>{item.cost}</div>
                                    <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.7)' }}>{item.budget}</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="wc-affiliates-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem' }}>
                        {[
                            { href:'https://wise.prf.hn/click/camref:1110lFqtW', color:'#9FE870', bg:'rgba(159,232,112,0.12)', border:'rgba(159,232,112,0.4)', label:'Wise', desc:'Exchange currency', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9FE870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
                            { href:'https://www.awin1.com/cread.php?awinmid=18119&awinaffid=2865959', color:'#4A90D9', bg:'rgba(74,144,217,0.12)', border:'rgba(74,144,217,0.4)', label:'Booking.com', desc:'Find hotels', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                            { href:'https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959', color:'#FF6600', bg:'rgba(255,102,0,0.12)', border:'rgba(255,102,0,0.4)', label:'RentalCars', desc:'Rent a car', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
                            { href:'https://www.getyourguide.com/?partner_id=VVPTRVK', color:'#FF5533', bg:'rgba(255,85,51,0.12)', border:'rgba(255,85,51,0.4)', label:'GetYourGuide', desc:'Experiences', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
                        ].map(item => (
                            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem', background:item.bg, border:`1px solid ${item.border}`, borderRadius:'0.625rem', padding:'0.75rem 1rem', textDecoration:'none', textAlign:'center' }}>
                                <span style={{ fontSize:'1.25rem' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize:'0.85rem', fontWeight:900, color:item.color }}>{item.label}</div>
                                    <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.55)' }}>{item.desc}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            {/* â"€â"€ QUICK CONVERTER â"€â"€ */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0' }}><QuickConverter /></div>

            {/* BLOG PREVIEW */}
            
            {/* AFFILIATES BAR */}
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

 















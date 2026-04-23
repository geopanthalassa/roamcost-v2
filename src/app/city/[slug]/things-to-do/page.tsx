import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import { getCityImage } from '@/lib/cityImages';

interface ThingsToDoProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ThingsToDoProps) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country').eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!data) return { title: 'Things To Do | RoamCost' };
    const d = data as { city: string; country: string };
    return {
        title: `Best Things To Do in ${d.city}, ${d.country} 2026 | RoamCost`,
        description: `Discover the top tours, attractions, activities and experiences in ${d.city}. From cultural landmarks to food tours, outdoor adventures and nightlife. Complete travel guide.`,
        keywords: `things to do in ${d.city}, best tours ${d.city}, ${d.city} attractions, ${d.city} activities, ${d.city} travel guide, what to do ${d.city}, ${d.city} experiences, visit ${d.city}`,
        openGraph: {
            title: `Best Things To Do in ${d.city} 2026`,
            description: `Top tours, attractions and experiences in ${d.city}, ${d.country}.`,
            url: `https://www.roamcost.com/city/${slug}/things-to-do`,
        },
        alternates: { canonical: `https://www.roamcost.com/city/${slug}/things-to-do` },
    };
}

// Categories with icons and search terms
const CATEGORIES = [
    {
        id: 'tours',
        label: 'Walking Tours',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
        color: '#52B788',
        bg: '#F0FAF4',
        desc: 'Explore the city on foot with expert local guides',
        searchTerm: 'walking tour',
    },
    {
        id: 'food',
        label: 'Food & Drinks',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
        color: '#F7831E',
        bg: '#FFF8F0',
        desc: 'Taste local cuisine, street food and cooking classes',
        searchTerm: 'food tour',
    },
    {
        id: 'culture',
        label: 'Culture & History',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>,
        color: '#8b5cf6',
        bg: '#F5F3FF',
        desc: 'Museums, landmarks, historical sites and art galleries',
        searchTerm: 'museum cultural tour',
    },
    {
        id: 'outdoor',
        label: 'Outdoor & Nature',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
        color: '#40916C',
        bg: '#F0FAF4',
        desc: 'Hiking, cycling, water sports and nature excursions',
        searchTerm: 'outdoor adventure',
    },
    {
        id: 'daytrips',
        label: 'Day Trips',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
        color: '#3b82f6',
        bg: '#EFF6FF',
        desc: 'Explore nearby destinations and surrounding regions',
        searchTerm: 'day trip excursion',
    },
    {
        id: 'nightlife',
        label: 'Nightlife & Shows',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
        color: '#ec4899',
        bg: '#FDF2F8',
        desc: 'Flamenco shows, concerts, bars and entertainment',
        searchTerm: 'nightlife show entertainment',
    },
];

export const dynamic = 'force-dynamic';

export default async function ThingsToDoPage({ params }: ThingsToDoProps) {
    const { slug } = await params;

    const { data: cityData } = await supabase
        .from('cities_master')
        .select('*')
        .eq('slug', slug)
        .order('population', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!cityData) notFound();
    const city = cityData as unknown as City;

    const heroImage = getCityImage(slug, 1400, 500, city.city);
    const KLOOK_ID = '119390';

    // JSON-LD structured data
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: city.city,
        description: `Best things to do in ${city.city}, ${city.country}. Tours, attractions and activities.`,
        url: `https://www.roamcost.com/city/${slug}/things-to-do`,
        containedInPlace: { '@type': 'Country', name: city.country },
        touristType: ['Cultural Tourism', 'Adventure Tourism', 'Food Tourism'],
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            {/* Hero */}
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                <img src={heroImage} alt={`${city.city} attractions`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2rem 2.5rem' }}>
                    <nav style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0.5rem' }}>→</span>
                        <Link href={`/city/${slug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{city.city}</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0.5rem' }}>→</span>
                        <span style={{ color: 'white' }}>Things to do</span>
                    </nav>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                        Best Things To Do in {city.city}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: 0 }}>
                        {city.country} · Tours, attractions & experiences
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

                {/* Quick booking strip */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Book instantly</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Find tours & activities in {city.city}</div>
                    </div>
                    
                    <a href={`https://www.viator.com/search/${encodeURIComponent(city.city)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                        Search Viator →
                    </a>
                    <a href={`https://affiliate.klook.com/redirect?aid=${KLOOK_ID}&k_site=${encodeURIComponent('https://www.klook.com/s/' + city.city)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                        Search Klook →
                    </a>
                </div>

                {/* Category cards */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                    Explore by category
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                    {CATEGORIES.map(cat => (
                        <a key={cat.id}
                            href={`https://www.klook.com/s/${encodeURIComponent(cat.searchTerm + ' ' + city.city)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', backgroundColor: cat.bg, borderRadius: '1rem', border: `1px solid ${cat.color}22`, textDecoration: 'none', transition: 'transform 0.15s' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cat.color, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                                {cat.icon}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>{cat.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{cat.desc}</div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, marginTop: '0.5rem' }}>Browse on Klook →</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Editorial content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            About {city.city}
                        </h2>
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                            <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 1rem' }}>
                                {city.city} is one of the most visited destinations in {city.country}, attracting travelers with its unique blend of culture, history and modern life.
                                {city.population ? ` With a population of over ${(city.population / 1000000).toFixed(1)} million people, it's a vibrant metropolis` : ''} that offers something for every type of traveler.
                            </p>
                            <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
                                Whether you're looking for historical landmarks, culinary experiences, outdoor adventures or cultural immersion, {city.city} delivers unforgettable experiences.
                                The city is best explored through a mix of guided tours and independent exploration.
                            </p>
                        </div>

                        {/* Top experiences list */}
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                            Top experiences in {city.city}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {[
                                { title: `Best walking tours in ${city.city}`, desc: 'Discover hidden gems and iconic landmarks with expert local guides', term: 'best walking tour' },
                                { title: `${city.city} food tours`, desc: 'Taste authentic local cuisine and learn about culinary traditions', term: 'food tour cooking class' },
                                { title: `Skip-the-line museum tickets in ${city.city}`, desc: 'Save time at the most popular attractions', term: 'skip the line museum' },
                                { title: `Day trips from ${city.city}`, desc: 'Explore beautiful nearby destinations and surrounding regions', term: 'day trip from' },
                                { title: `${city.city} night tours & shows`, desc: 'Experience the city after dark with entertainment and nightlife', term: 'night tour show' },
                            ].map((exp, i) => (
                                <a key={i}
                                    href={`https://www.klook.com/s/${encodeURIComponent(exp.term + ' ' + city.city)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#F0FAF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 900, color: '#52B788' }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{exp.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{exp.desc}</div>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </a>
                            ))}
                        </div>

                        {/* Travel tips */}
                        <div style={{ backgroundColor: '#F0FAF4', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #95D5B2' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Travel tips for {city.city}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {[
                                    'Book popular tours at least 48 hours in advance, especially in peak season',
                                    'Many attractions offer free entry on the first Sunday of each month',
                                    'Guided tours often include skip-the-line access to major landmarks',
                                    'Local food markets are great for authentic experiences at lower prices',
                                    'Early morning tours avoid crowds at popular tourist sites',
                                ].map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#52B788', flexShrink: 0, marginTop: '7px' }} />
                                        <span style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '90px' }}>
                        {/* Cost context */}
                        {(city.cost_index ?? 0) > 0 && (
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Cost context</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Budget meal', value: city.food_index > 0 ? `$${Math.round(city.food_index)}` : 'N/A' },
                                        { label: 'Monthly rent (avg)', value: city.rent_index > 0 ? `$${Math.round(city.rent_index)}` : 'N/A' },
                                        { label: 'Safety score', value: city.safety > 0 ? `${city.safety}/10` : 'N/A' },
                                        { label: 'Quality of life', value: city.cost_index > 0 ? `${Math.round(city.cost_index)}/900` : 'N/A' },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.625rem', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.label}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href={`/city/${slug}`} style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700, color: '#52B788', textDecoration: 'none' }}>
                                    Full cost breakdown →
                                </Link>
                            </div>
                        )}

                        {/* Book now CTAs */}
                        <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Book tours</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '1.25rem' }}>Ready to explore {city.city}?</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <a href={`https://www.klook.com/s/${encodeURIComponent(city.city)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'block', textAlign: 'center', backgroundColor: '#F7831E', color: 'white', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: 800, fontSize: '0.875rem', textDecoration: 'none' }}>
                                    Book on Klook
                                </a>
                                <a href={`https://www.viator.com/search/${encodeURIComponent(city.city)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'block', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    Book on Viator
                                </a>
                                <a href={`https://www.tripadvisor.com/Attractions-a_geo.${encodeURIComponent(city.city)}.html`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'block', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    Explore on Tripadvisor
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom nav */}
                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href={`/city/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', textDecoration: 'none', fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                        ← Back to {city.city} overview
                    </Link>
                    <Link href="/compare" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#52B788', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>
                        Compare {city.city} with another city →
                    </Link>
                </div>
            </div>
        </div>
    );
}

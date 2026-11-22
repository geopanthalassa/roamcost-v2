import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PlacePhoto from '@/components/PlacePhoto';
import { highlightText } from '@/lib/highlight';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface Props { params: Promise<{ slug: string }> }

interface Place {
    id: string; category: string; name: string; rating: number | null; rating_count: number | null;
    address: string | null; maps_url: string | null; photo_name: string | null;
}
interface City { city: string; country: string; slug: string; total_usd: number | null; rent_usd: number | null; food_usd: number | null; }

const AFFILIATE = 'https://tp.media/r?campaign_id=100&marker=711539&p=4114&trs=568806&u=https%3A%2F%2Faviasales.com';

async function load(slug: string) {
    const { data: c } = await supabase
        .from('cities_master')
        .select('city, country, slug, total_usd, rent_usd, food_usd')
        .eq('slug', slug).order('population', { ascending: false }).limit(1).maybeSingle();
    if (!c) return null;
    const { data: p } = await supabase.from('city_places').select('*').eq('city_slug', slug);
    const places = (p || []) as unknown as Place[];
    if (places.length === 0) return null;
    return { city: c as unknown as City, places };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const d = await load(slug);
    if (!d) return { title: 'Itinerary | RoamCost' };
    return {
        title: `${d.city.city} 3-Day Itinerary: Must-See Sights, Hidden Gems & Where to Eat | RoamCost`,
        description: `A 3-day ${d.city.city} itinerary built from real Google ratings: top attractions, hidden gems and the best places to eat, plus what it costs to live there.`,
        alternates: { canonical: `https://www.roamcost.com/destinations/${slug}` },
    };
}

type Stop = { time: string; kind: string; place: Place };

const KIND_COLORS: Record<string, string> = {
    'Must-see': '#16a34a',
    'Hidden gem': '#7c3aed',
    'Good and affordable': '#ea580c',
    'Top-rated restaurant': '#db2777',
    'Fine dining': '#b45309',
};
const DAY_COLORS = ['#52B788', '#3b82f6', '#F7831E'];

function pick(list: Place[], used: Set<string>): Place | undefined {
    const p = list.find(x => !used.has(x.name));
    if (p) used.add(p.name);
    return p;
}

function buildDays(places: Place[]) {
    const by = (cat: string, key: 'rating' | 'rating_count') =>
        places.filter(p => p.category === cat)
            .sort((a, b) => ((b[key] ?? 0) - (a[key] ?? 0)));
    const must = by('attraction_must_see', 'rating_count');
    const gems = by('attraction_hidden_gem', 'rating');
    const cheap = by('restaurant_cheap_good', 'rating');
    const top = by('restaurant_top_rated', 'rating');
    const lux = by('restaurant_luxury', 'rating');
    const used = new Set<string>();
    const mk = (time: string, kind: string, p?: Place): Stop | null => (p ? { time, kind, place: p } : null);

    const days: { title: string; blurb: string; stops: Stop[] }[] = [
        {
            title: 'Day 1: The icons',
            blurb: 'The places most visitors come for, ranked by how many people have reviewed them.',
            stops: [
                mk('Morning', 'Must-see', pick(must, used)),
                mk('Late morning', 'Must-see', pick(must, used)),
                mk('Lunch', 'Good and affordable', pick(cheap, used)),
                mk('Afternoon', 'Must-see', pick(must, used)),
                mk('Dinner', 'Top-rated restaurant', pick(top, used)),
            ].filter(Boolean) as Stop[],
        },
        {
            title: 'Day 2: Beyond the obvious',
            blurb: 'Highly rated spots with fewer crowds.',
            stops: [
                mk('Morning', 'Hidden gem', pick(gems, used)),
                mk('Late morning', 'Hidden gem', pick(gems, used)),
                mk('Lunch', 'Good and affordable', pick(cheap, used)),
                mk('Afternoon', 'Must-see', pick(must, used)),
                mk('Dinner', 'Top-rated restaurant', pick(top, used)),
            ].filter(Boolean) as Stop[],
        },
        {
            title: 'Day 3: Local favorites',
            blurb: 'A slower day: one more sight, one more hidden gem and a longer dinner.',
            stops: [
                mk('Morning', 'Must-see', pick(must, used)),
                mk('Late morning', 'Hidden gem', pick(gems, used)),
                mk('Lunch', 'Good and affordable', pick(cheap, used)),
                mk('Dinner', lux.length ? 'Fine dining' : 'Top-rated restaurant', pick(lux.length ? lux : top, used)),
            ].filter(Boolean) as Stop[],
        },
    ];
    return days.filter(d => d.stops.length > 0);
}

export default async function DestinationPage({ params }: Props) {
    const { slug } = await params;
    const d = await load(slug);
    if (!d) notFound();
    const { city, places } = d;
    const days = buildDays(places);
    const perDay = city.total_usd ? Math.round(city.total_usd / 30) : null;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 1.5rem 4rem' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.roamcost.com' },
                    { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://www.roamcost.com/destinations' },
                    { '@type': 'ListItem', position: 3, name: `${city.city} 3-day itinerary`, item: `https://www.roamcost.com/destinations/${slug}` },
                ],
            }).replace(/</g, '\\u003c') }} />
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <nav style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>→</span>
                    <Link href="/destinations" style={{ color: '#94a3b8', textDecoration: 'none' }}>Destinations</Link>
                    <span style={{ margin: '0 0.5rem' }}>→</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{city.city}</span>
                </nav>

                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                    {city.city}: 3-Day Must-See Itinerary
                </h1>
                <p style={{ color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                    A simple plan for {city.city}, {city.country}, built from Google ratings and review counts: the landmarks people visit most, highly rated hidden gems and good places to eat. Check opening hours on the map link before you go, and group stops by neighborhood to save travel time.
                </p>

                {city.total_usd ? (
                    <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '2rem' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>What it costs</div>
                        <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            <span dangerouslySetInnerHTML={{ __html: highlightText(`Living in ${city.city} costs about $${city.total_usd.toLocaleString()} a month for one person (rent $${city.rent_usd?.toLocaleString() ?? 'n/a'}, food $${city.food_usd?.toLocaleString() ?? 'n/a'}), roughly $${perDay} a day on average.`) }} /> Short-stay travelers pay more for hotels. <Link href={`/city/${slug}`} style={{ color: '#3b82f6', fontWeight: 700 }}>See the full cost breakdown</Link>.
                        </div>
                    </div>
                ) : null}

                {days.map(day => (
                    <section key={day.title} style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', borderLeft: `5px solid ${DAY_COLORS[days.indexOf(day) % 3]}`, background: `${DAY_COLORS[days.indexOf(day) % 3]}14`, padding: '0.55rem 0.85rem', borderRadius: '0 0.6rem 0.6rem 0' }}>{day.title}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem' }}>{day.blurb}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {day.stops.map((s, i) => (
                                <a key={i} href={s.place.maps_url || '#'} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', gap: 0, backgroundColor: 'white', border: '1px solid #e2e8f0', borderLeft: `5px solid ${KIND_COLORS[s.kind] || '#52B788'}`, borderRadius: '0.875rem', overflow: 'hidden', textDecoration: 'none' }}>
                                    {s.place.photo_name && (
                                        <PlacePhoto photoName={s.place.photo_name} alt={s.place.name}
                                            style={{ width: '96px', alignSelf: 'stretch', objectFit: 'cover', flexShrink: 0 }} />
                                    )}
                                    <div style={{ padding: '0.9rem 1rem', minWidth: 0 }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: KIND_COLORS[s.kind] || '#52B788', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.time} · {s.kind}</div>
                                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', margin: '0.2rem 0' }}>{s.place.name}</div>
                                        {s.place.rating != null && (
                                            <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 800, background: '#fef3c7', display: 'inline-block', padding: '0.05rem 0.45rem', borderRadius: '0.4rem' }}>
                                                Rating {s.place.rating}{s.place.rating_count ? ` (${s.place.rating_count.toLocaleString()} reviews)` : ''}
                                            </div>
                                        )}
                                        {s.place.address && <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{s.place.address}</div>}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}

                <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Ready to go to {city.city}?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>Compare flight prices, then check every rated place on the full list.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={AFFILIATE} target="_blank" rel="noopener noreferrer sponsored"
                            style={{ backgroundColor: '#F7831E', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>Compare flights</a>
                        <Link href={`/city/${slug}/places`}
                            style={{ backgroundColor: '#52B788', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>All places in {city.city}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

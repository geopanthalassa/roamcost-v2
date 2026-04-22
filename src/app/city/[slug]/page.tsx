// SERVER COMPONENT - Google indexa todo
import { supabase } from '@/lib/supabase';
import { getCityImage } from '@/lib/pexels';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface CityPageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: CityPageProps) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country').eq('slug', slug).maybeSingle();
    if (!data) return { title: 'City Not Found | RoamCost' };
    const d = data as { city: string; country: string };
    return {
        title: `Cost of Living in ${d.city}, ${d.country} 2026 | RoamCost`,
        description: `Compare rent, food, safety and quality of life in ${d.city}. Real data for digital nomads and expats.`,
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
    const heroImage = await getCityImage(c.city, c.country);

    const { data: related } = await supabase
        .from('cities_master').select('*')
        .eq('country', c.country)
        .neq('slug', slug)
        .gt('cost_index', 0)
        .order('population', { ascending: false })
        .limit(3) as unknown as { data: City[] };

    const rent = (c.rent_index ?? 0) * 10;
    const food = (c.food_index ?? 0) * 5;
    const transport = (c.transport_index ?? 0) * 2;
    const utilities = (c.utilities_index ?? 0) * 3;
    const monthly = Math.round(rent + food + transport + utilities);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

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
                                    <span style={{ backgroundColor: '#5b8c71', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '2rem', fontWeight: 800, fontSize: '0.95rem' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Monthly Budget', value: `$${monthly.toLocaleString()}`, sub: 'all-in estimate', color: '#5b8c71', bg: '#f0fdf4' },
                                { label: 'Annual Cost', value: `$${(monthly * 12).toLocaleString()}`, sub: 'per year', color: '#3b82f6', bg: '#eff6ff' },
                                { label: 'Internet', value: c.internet != null ? `${c.internet} Mbps` : 'N/A', sub: (c.internet ?? 0) >= 50 ? 'Excellent' : (c.internet ?? 0) >= 20 ? 'Good' : 'Limited', color: '#8b5cf6', bg: '#f5f3ff' },
                                { label: 'Safety', value: c.safety != null ? `${c.safety}/10` : 'N/A', sub: (c.safety ?? 0) >= 7 ? 'Very safe' : (c.safety ?? 0) >= 5 ? 'Moderate' : 'Caution', color: (c.safety ?? 0) >= 7 ? '#16a34a' : '#d97706', bg: (c.safety ?? 0) >= 7 ? '#f0fdf4' : '#fffbeb' },
                            ].map(s => (
                                <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '1rem', padding: '1.25rem', border: `1px solid ${s.color}22` }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Monthly Living Costs</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.75rem' }}>Estimated breakdown in USD</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { label: 'Rent / Housing', usd: rent, value: c.rent_index ?? 0, color: '#5b8c71', icon: '🏠' },
                                        { label: 'Food & Dining', usd: food, value: c.food_index ?? 0, color: '#3b82f6', icon: '🍽️' },
                                        { label: 'Transport', usd: transport, value: c.transport_index ?? 0, color: '#8b5cf6', icon: '🚌' },
                                        { label: 'Utilities', usd: utilities, value: c.utilities_index ?? 0, color: '#f59e0b', icon: '⚡' },
                                    ].map((m) => (
                                        <div key={m.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                                <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>{m.icon} {m.label}</span>
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
                                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#5b8c71' }}>${monthly.toLocaleString()}/mo</span>
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
                                        { label: 'Safety', value: c.safety, icon: '🛡️', max: 10 },
                                        { label: 'Healthcare', value: c.healthcare, icon: '🏥', max: 10 },
                                        { label: 'Internet', value: c.internet, icon: '📡', unit: 'Mbps', max: 100 },
                                        { label: 'Environment', value: c.environment, icon: '🌿', max: 10 },
                                        { label: 'Leisure', value: c.leisure, icon: '🎭', max: 10 },
                                        { label: 'Outdoors', value: c.outdoors, icon: '🏔️', max: 10 },
                                    ].map((m) => {
                                        const val = m.value ?? 0;
                                        const good = m.max === 100 ? val >= 30 : val >= 6;
                                        return (
                                            <div key={m.label} style={{ padding: '1rem', backgroundColor: good ? '#f0fdf4' : '#fafafa', border: `1px solid ${good ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{m.icon}</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: good ? '#16a34a' : '#94a3b8' }}>
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
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Detailed cost data coming soon for {c.city}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
                            We're working on adding detailed cost of living data for this city. Meanwhile, explore hotels, flights and local experiences below.
                        </p>
                        <Link href="/rankings/quality" style={{ display: 'inline-block', backgroundColor: '#5b8c71', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
                            See cities with full data →
                        </Link>
                    </div>
                )}

                {/* TRAVEL — always visible */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>✈️ Plan your trip to {c.city}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Find the best deals on flights, hotels and long-term stays</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { icon: '🏨', label: `Hotels in ${c.city}`, sub: 'via Booking.com', color: '#003580', bg: '#eff6ff', href: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(c.city + ', ' + c.country)}` },
                            { icon: '✈️', label: `Flights to ${c.city}`, sub: 'via Kiwi.com', color: '#e8612c', bg: '#fff7ed', href: `https://www.kiwi.com/en/search/results/anywhere/${encodeURIComponent(c.city.toLowerCase().replace(/ /g, '-'))}/anytime/anytime` },
                            { icon: '🏠', label: 'Long-term Stays', sub: 'via Airbnb', color: '#ff385c', bg: '#fff1f2', href: `https://www.airbnb.com/s/${encodeURIComponent(c.city)}/homes` },
                        ].map(link => (
                            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: link.bg, borderRadius: '0.875rem', textDecoration: 'none', color: '#0f172a', border: `1px solid ${link.color}22` }}>
                                <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{link.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>{link.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: link.color, fontWeight: 600, marginTop: '2px' }}>{link.sub}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {related && related.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Other cities in {c.country}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {related.map(rc => <CityCard key={rc.slug} city={rc} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

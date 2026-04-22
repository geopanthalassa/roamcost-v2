// ✅ SERVER COMPONENT — Google indexa todo
// ✅ Columna "long" corregida (no "lng") — fix principal del bug de Supabase
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import WeatherWidget from '@/components/WeatherWidget';

interface CityPageProps { params: Promise<{ slug: string }>; }
export async function generateMetadata({ params }: CityPageProps) {
    const { slug } = await params;
    const { data } = await supabase.from('cities_master').select('city, country').eq('slug', slug).single();
    if (!data) return { title: 'City Not Found | RoamCost' };
    const city = data as { city: string; country: string };
    return {
        title: `Cost of Living in ${city.city}, ${city.country} 2026 | RoamCost`,
        description: `Compare rent, food, safety and quality of life in ${city.city}. Real data for digital nomads and expats.`,
        openGraph: { title: `${city.city} Cost of Living 2026 | RoamCost`, description: `Everything you need to know before moving to ${city.city}.` },
    };
}
export const dynamic = 'force-dynamic';

export default async function CityPage({ params }: CityPageProps) {
    const { slug } = await params;
    const { data: city } = await supabase.from('cities_master').select('*').eq('slug', slug).single();
    if (!city) notFound();
    const c = city as City;

    const { data: relatedCities } = await supabase
        .from('cities_master').select('*')
        .eq('country', c.country).neq('slug', slug)
        .not('slug', 'is', null).not('population', 'is', null)
        .order('population', { ascending: false }).limit(3) as unknown as { data: City[] };

    const rent = (c.rent_index ?? 0) * 10;
    const food = (c.food_index ?? 0) * 5;
    const transport = (c.transport_index ?? 0) * 2;
    const utilities = (c.utilities_index ?? 0) * 3;
    const estimatedMonthly = Math.round(rent + food + transport + utilities);

    const dynamicImage = `https://source.unsplash.com/featured/1400x700?${encodeURIComponent(c.city)},cityscape`;

    const costMetrics = [
        { label: 'Rent / Housing', usd: rent, value: c.rent_index ?? 0, color: '#5b8c71', icon: '🏠' },
        { label: 'Food & Dining', usd: food, value: c.food_index ?? 0, color: '#3b82f6', icon: '🍽️' },
        { label: 'Transport', usd: transport, value: c.transport_index ?? 0, color: '#8b5cf6', icon: '🚌' },
        { label: 'Utilities', usd: utilities, value: c.utilities_index ?? 0, color: '#f59e0b', icon: '⚡' },
    ];

    const qualityMetrics = [
        { label: 'Safety', value: c.safety, icon: '🛡️', max: 10 },
        { label: 'Healthcare', value: c.healthcare, icon: '🏥', max: 10 },
        { label: 'Internet', value: c.internet, icon: '📡', unit: 'Mbps', max: 100 },
        { label: 'Environment', value: c.environment, icon: '🌿', max: 10 },
        { label: 'Leisure', value: c.leisure, icon: '🎭', max: 10 },
        { label: 'Outdoors', value: c.outdoors, icon: '🏔️', max: 10 },
    ];

    return (
        <div className="container section animate-fade-in">
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <Link href="/" style={{ color: '#5b8c71', fontWeight: 600 }}>Home</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <Link href="/rankings/quality" style={{ color: '#5b8c71', fontWeight: 600 }}>Cities</Link>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{c.city}</span>
            </nav>

            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', minHeight: '480px', display: 'flex', alignItems: 'flex-end', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${dynamicImage}), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1400)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '3rem 4rem', color: 'white', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8, marginBottom: '0.5rem' }}>
                                {c.country}{c.population ? ` • ${c.population.toLocaleString()} inhabitants` : ''}
                            </p>
                            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '1.5rem', lineHeight: 1 }}>{c.city}</h1>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {estimatedMonthly > 0 && (
                                    <span style={{ backgroundColor: '#5b8c71', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '2rem', fontWeight: 800 }}>
                                        ~${estimatedMonthly.toLocaleString()}/month
                                    </span>
                                )}
                                {c.cost_index != null && (
                                    <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '2rem', fontWeight: 700 }}>
                                        Quality Score: {c.cost_index}
                                    </span>
                                )}
                                <WeatherWidget lat={c.lat} long={c.long} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link href={`/compare?city1=${c.slug}`} style={{ backgroundColor: 'white', color: '#0f172a', padding: '0.875rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}>Compare →</Link>
                            <Link href={`/city/${c.slug}/things-to-do`} style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.875rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>Things to do</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Monthly Budget', value: estimatedMonthly > 0 ? `$${estimatedMonthly.toLocaleString()}` : 'N/A', sub: 'all-in estimate', color: '#5b8c71' },
                    { label: 'Annual Cost', value: estimatedMonthly > 0 ? `$${(estimatedMonthly * 12).toLocaleString()}` : 'N/A', sub: 'per year', color: '#3b82f6' },
                    { label: 'Internet Speed', value: c.internet != null ? `${c.internet} Mbps` : 'N/A', sub: (c.internet ?? 0) >= 50 ? 'Excellent' : (c.internet ?? 0) >= 20 ? 'Good' : 'Limited', color: '#8b5cf6' },
                    { label: 'Safety Index', value: c.safety != null ? `${c.safety}/10` : 'N/A', sub: (c.safety ?? 0) >= 7 ? 'Very safe' : (c.safety ?? 0) >= 5 ? 'Moderate' : 'Caution', color: (c.safety ?? 0) >= 7 ? '#16a34a' : (c.safety ?? 0) >= 5 ? '#d97706' : '#dc2626' },
                ].map(stat => (
                    <div key={stat.label} className="card" style={{ padding: '1.5rem', textAlign: 'center', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
                <section className="card" style={{ padding: '2.5rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Monthly Living Costs</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Estimated breakdown in USD</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {costMetrics.map((metric) => (
                            <div key={metric.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{metric.icon} {metric.label}</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 900, color: '#0f172a' }}>${Math.round(metric.usd).toLocaleString()}</span>
                                        <CurrencyDisplay usdAmount={metric.usd} />
                                    </div>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min(metric.value, 100)}%`, backgroundColor: metric.color, borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ paddingTop: '1rem', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Estimate</span>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#5b8c71' }}>${estimatedMonthly.toLocaleString()}/mo</span>
                                <CurrencyDisplay usdAmount={estimatedMonthly} large />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="card" style={{ padding: '2.5rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Quality of Life</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Indexed scores for key life factors</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {qualityMetrics.map((metric) => {
                            const val = metric.value ?? 0;
                            const good = metric.max === 100 ? val >= 30 : val >= 6;
                            return (
                                <div key={metric.label} style={{ padding: '1.25rem', backgroundColor: good ? '#f0fdf4' : '#fafafa', border: `1px solid ${good ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{metric.icon}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: good ? '#16a34a' : '#64748b', marginBottom: '0.2rem' }}>
                                        {metric.value != null ? metric.value : '—'}{metric.unit ? ` ${metric.unit}` : ''}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            <section className="card" style={{ padding: '2.5rem', marginBottom: '2rem', boxShadow: 'none', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>✈️ Ready to visit {c.city}?</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Find the best deals on flights, hotels and long-term stays.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { icon: '🏨', label: `Hotels in ${c.city}`, sub: 'via Booking.com', href: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(c.city + ', ' + c.country)}` },
                        { icon: '✈️', label: `Flights to ${c.city}`, sub: 'via Kiwi.com', href: `https://www.kiwi.com/en/search/results/anywhere/${encodeURIComponent(c.city.toLowerCase().replace(/ /g, '-'))}/anytime/anytime` },
                        { icon: '🏠', label: 'Long-term Stays', sub: 'via Airbnb', href: `https://www.airbnb.com/s/${encodeURIComponent(c.city)}/homes` },
                    ].map(link => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.75rem 1.25rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a' }}>
                            <span style={{ fontSize: '2rem' }}>{link.icon}</span>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{link.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#5b8c71', fontWeight: 600, marginTop: '2px' }}>{link.sub}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {relatedCities && relatedCities.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Other cities in {c.country}</h2>
                    <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
                        {relatedCities.map(rc => <CityCard key={rc.slug} city={rc} />)}
                    </div>
                </section>
            )}

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "City", "name": c.city, "containedInPlace": { "@type": "Country", "name": c.country }, "description": `Cost of living in ${c.city}: ~$${estimatedMonthly}/month. Safety: ${c.safety ?? 'N/A'}/10.` }) }} />
        </div>
    );
}

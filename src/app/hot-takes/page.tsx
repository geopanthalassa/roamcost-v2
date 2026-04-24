import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Hot Takes — City Cost Comparisons 2026 | RoamCost',
    description: 'Viral city comparisons updated for 2026. Bangkok vs Bali, NYC vs CDMX, Lisbon vs Barcelona. Real data, no fluff.',
    keywords: 'city cost comparison 2026, bangkok vs bali, new york vs mexico city, lisbon vs barcelona, cheapest cities digital nomads',
    alternates: { canonical: 'https://www.roamcost.com/hot-takes' },
};

const TAKES = [
    { slug: 'bangkok-vs-bali', en: { title: 'Bangkok vs Bali', subtitle: 'The Ultimate Nomad Showdown', tag: 'Most Popular' }, es: { subtitle: 'El duelo definitivo de los nómadas' }, cities: ['Bangkok', 'Bali'], budget: '$900–1,800/mo', region: 'Asia', color: '#3b82f6', image: 'photo-1508009603885-50cf7c579365', hot: true },
    { slug: 'new-york-vs-mexico-city', en: { title: 'New York vs Mexico City', subtitle: 'Same energy. 70% cheaper.', tag: 'Trending' }, es: { subtitle: 'La misma energía, 70% más barato' }, cities: ['New York', 'CDMX'], budget: '$1,400–6,500/mo', region: 'Americas', color: '#F7831E', image: 'photo-1496442226666-8d4d0e62e6e9', hot: true },
    { slug: 'la-vs-miami-vs-mexico-city', en: { title: 'LA vs Miami vs CDMX', subtitle: 'Where smart Americans live now', tag: 'Viral' }, es: { subtitle: 'Donde los americanos inteligentes viven ahora' }, cities: ['LA', 'Miami', 'CDMX'], budget: '$1,400–6,500/mo', region: 'Americas', color: '#ef4444', image: 'photo-1534190760961-74e8c1c5c3da', hot: true },
    { slug: 'lisbon-vs-barcelona', en: { title: 'Lisbon vs Barcelona', subtitle: 'Europe on a budget — which wins?', tag: 'Europe' }, es: { subtitle: '¿Cuál es más barata para vivir en Europa?' }, cities: ['Lisbon', 'Barcelona'], budget: '$1,700–3,000/mo', region: 'Europe', color: '#52B788', image: 'photo-1585208798174-6cedd4454069', hot: false },
    { slug: 'berlin-vs-bucharest', en: { title: 'Berlin vs Bucharest', subtitle: "Eastern Europe's best kept secret", tag: 'Hidden Gem' }, es: { subtitle: 'El secreto mejor guardado de Europa' }, cities: ['Berlin', 'Bucharest'], budget: '$900–2,700/mo', region: 'Europe', color: '#8b5cf6', image: 'photo-1560969184-10fe8719e047', hot: false },
    { slug: 'chiang-mai-vs-medellin', en: { title: 'Chiang Mai vs Medellín', subtitle: 'Mountains, coffee and $1k/month', tag: 'Budget Pick' }, es: { subtitle: 'Montañas, café y vida por $1k/mes' }, cities: ['Chiang Mai', 'Medellín'], budget: '$900–1,600/mo', region: 'Asia / LatAm', color: '#10b981', image: 'photo-1596422846543-75c6fc197f07', hot: false },
    { slug: 'dubai-vs-singapore', en: { title: 'Dubai vs Singapore', subtitle: '0% income tax — which is cheaper?', tag: 'Tax Free' }, es: { subtitle: '0% impuesto — ¿pero cuál sale más barata?' }, cities: ['Dubai', 'Singapore'], budget: '$2,500–5,000/mo', region: 'Middle East / Asia', color: '#f59e0b', image: 'photo-1512453979798-5ea266f8880c', hot: false },
    { slug: 'buenos-aires-vs-lima', en: { title: 'Buenos Aires vs Lima', subtitle: "South America's best — compared", tag: 'LatAm' }, es: { subtitle: 'Las mejores ciudades de Sudamérica' }, cities: ['Buenos Aires', 'Lima'], budget: '$800–1,400/mo', region: 'Latin America', color: '#ef4444', image: 'photo-1619946794135-5bc917a27793', hot: false },
    { slug: 'tokyo-vs-seoul', en: { title: 'Tokyo vs Seoul 2026', subtitle: 'Japan or Korea — the real numbers', tag: 'Asia' }, es: { subtitle: 'Japón o Corea — los números reales' }, cities: ['Tokyo', 'Seoul'], budget: '$1,400–2,800/mo', region: 'Asia', color: '#ec4899', image: 'photo-1540959733332-eab4deabeeaf', hot: false },
    { slug: 'amsterdam-vs-prague', en: { title: 'Amsterdam vs Prague', subtitle: 'Smart Europe vs Expensive Europe', tag: 'Europe' }, es: { subtitle: 'Europa inteligente vs Europa cara' }, cities: ['Amsterdam', 'Prague'], budget: '$1,100–3,500/mo', region: 'Europe', color: '#6366f1', image: 'photo-1512470876302-972faa2aa9a4', hot: false },
    { slug: 'lisbon-vs-tbilisi', en: { title: 'Lisbon vs Tbilisi', subtitle: '365-day visa vs D8 — nomad battle', tag: 'Visa Guide' }, es: { subtitle: 'Visa 365 días vs D8 — el nuevo debate nómada' }, cities: ['Lisbon', 'Tbilisi'], budget: '$800–2,400/mo', region: 'Europe', color: '#52B788', image: 'photo-1585208798174-6cedd4454069', hot: false },
    { slug: 'sydney-vs-melbourne', en: { title: 'Sydney vs Melbourne 2026', subtitle: "Australia's eternal rivalry", tag: 'Oceania' }, es: { subtitle: 'La rivalidad eterna de Australia' }, cities: ['Sydney', 'Melbourne'], budget: '$2,500–4,000/mo', region: 'Oceania', color: '#0ea5e9', image: 'photo-1506973035872-a4ec16b8e8d9', hot: false },
];

export default function HotTakesPage() {
    const GREEN = '#52B788';
    const hot = TAKES.filter(t => t.hot);
    const rest = TAKES.filter(t => !t.hot);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '4rem 0 3rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '0.25rem 0.625rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live</div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Updated April 2026 · Actualizado abril 2026</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', margin: '0 0 0.75rem', letterSpacing: '-0.04em' }}>Hot Takes</h1>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', margin: '0 0 0.5rem', maxWidth: '600px' }}>
                        Real city comparisons with real data. No sponsored content, no fluff.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 }}>
                        Comparaciones reales de ciudades con datos reales. Sin publicidad, sin relleno.
                    </p>
                    <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem' }}>
                        {[['12', 'Comparisons'], ['24', 'Cities'], ['Monthly', 'Updated']].map(([n, l]) => (
                            <div key={l}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: GREEN }}>{n}</div>
                                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* Trending */}
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Trending this week</p>
                <div className="hot-takes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
                    {hot.map(t => <TakeCard key={t.slug} take={t} featured />)}
                </div>

                {/* All */}
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>All comparisons · Todas las comparaciones</p>
                <div className="hot-takes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
                    {rest.map(t => <TakeCard key={t.slug} take={t} />)}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.75rem', letterSpacing: '-0.03em' }}>Compare any two cities yourself</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 0.5rem' }}>Real data. Your lifestyle. Your budget.</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', margin: '0 0 2rem', fontSize: '0.875rem', fontStyle: 'italic' }}>Datos reales. Tu estilo de vida. Tu presupuesto.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none' }}>Compare cities →</Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>See rankings →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TakeCard({ take, featured = false }: { take: typeof TAKES[0], featured?: boolean }) {
    const GREEN = '#52B788';
    return (
        <Link href={`/hot-takes/${take.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', border: featured ? '2px solid #ef4444' : '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: featured ? '180px' : '150px', overflow: 'hidden', position: 'relative' }}>
                    <img src={`https://images.unsplash.com/${take.image}?auto=format&fit=crop&w=800&h=400&q=80`}
                        alt={take.en.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: featured ? '#ef4444' : take.color, color: 'white', fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {take.en.tag}
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {take.cities.map(c => (
                            <span key={c} style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{c}</span>
                        ))}
                    </div>
                </div>
                <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: featured ? '1rem' : '0.92rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>{take.en.title}</h3>
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.77rem', color: '#64748b', lineHeight: 1.4 }}>{take.en.subtitle}</p>
                    <p style={{ margin: '0 0 auto', fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.4, paddingBottom: '0.75rem' }}>{take.es.subtitle}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: GREEN }}>{take.budget}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: take.color }}>{take.region}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

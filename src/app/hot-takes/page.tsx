import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Hot Takes — City Cost Comparisons 2026 | RoamCost',
    description: 'Quick city comparisons updated for 2026. Bangkok vs Bali, NYC vs CDMX, Lisbon vs Barcelona. Real data, no fluff.',
    keywords: 'city cost comparison 2026, bangkok vs bali, new york vs mexico city, lisbon vs barcelona',
    alternates: { canonical: 'https://www.roamcost.com/hot-takes' },
};

const TAKES = [
    { slug: 'bangkok-vs-bali', en: 'Bangkok vs Bali', es: 'Bangkok vs Bali', tag: 'Most Popular', tagColor: '#3b82f6', cities: ['Bangkok', 'Bali'], a: { label: 'Bangkok', value: '$1,100/mo', win: true }, b: { label: 'Bali', value: '$1,800/mo', win: false }, hook: 'Asia\'s top 2 nomad cities. One is 40% cheaper.', hookEs: '2 destinos nómadas top. Uno es 40% más barato.', image: 'photo-1508009603885-50cf7c579365', hot: true },
    { slug: 'new-york-vs-mexico-city', en: 'New York vs Mexico City', es: 'Nueva York vs CDMX', tag: 'Trending', tagColor: '#F7831E', cities: ['New York', 'CDMX'], a: { label: 'New York', value: '$4,800/mo', win: false }, b: { label: 'CDMX', value: '$1,400/mo', win: true }, hook: 'Same energy. You save $3,400 every month.', hookEs: 'Misma energía. Ahorrás $3,400 al mes.', image: 'photo-1496442226666-8d4d0e62e6e9', hot: true },
    { slug: 'la-vs-miami-vs-mexico-city', en: 'LA vs Miami vs CDMX', es: 'LA vs Miami vs CDMX', tag: 'Viral', tagColor: '#ef4444', cities: ['LA', 'Miami', 'CDMX'], a: { label: 'LA', value: '$4,200/mo', win: false }, b: { label: 'CDMX', value: '$1,400/mo', win: true }, hook: 'Where smart Americans actually moved.', hookEs: 'Donde los americanos inteligentes se mudaron.', image: 'photo-1534190760961-74e8c1c5c3da', hot: true },
    { slug: 'lisbon-vs-barcelona', en: 'Lisbon vs Barcelona', es: 'Lisboa vs Barcelona', tag: 'Europe', tagColor: '#52B788', cities: ['Lisbon', 'Barcelona'], a: { label: 'Lisbon', value: '€1,900/mo', win: true }, b: { label: 'Barcelona', value: '€2,700/mo', win: false }, hook: 'Both have sun. One costs €800 more.', hookEs: 'Las dos tienen sol. Una cuesta €800 más.', image: 'photo-1585208798174-6cedd4454069', hot: false },
    { slug: 'berlin-vs-bucharest', en: 'Berlin vs Bucharest', es: 'Berlín vs Bucarest', tag: 'Hidden Gem', tagColor: '#8b5cf6', cities: ['Berlin', 'Bucharest'], a: { label: 'Berlin', value: '€2,400/mo', win: false }, b: { label: 'Bucharest', value: '€1,100/mo', win: true }, hook: '200 Mbps internet. EU member. Half the price.', hookEs: '200 Mbps. Miembro UE. La mitad del precio.', image: 'photo-1560969184-10fe8719e047', hot: false },
    { slug: 'chiang-mai-vs-medellin', en: 'Chiang Mai vs Medellín', es: 'Chiang Mai vs Medellín', tag: 'Budget', tagColor: '#10b981', cities: ['Chiang Mai', 'Medellín'], a: { label: 'Chiang Mai', value: '$1,100/mo', win: true }, b: { label: 'Medellín', value: '$1,350/mo', win: false }, hook: 'Under $1,500. Both incredible. Different worlds.', hookEs: 'Menos de $1,500. Las dos increíbles.', image: 'photo-1596422846543-75c6fc197f07', hot: false },
    { slug: 'dubai-vs-singapore', en: 'Dubai vs Singapore', es: 'Dubai vs Singapur', tag: 'Tax Free', tagColor: '#f59e0b', cities: ['Dubai', 'Singapore'], a: { label: 'Dubai', value: '$3,000/mo', win: true }, b: { label: 'Singapore', value: '$4,000/mo', win: false }, hook: '0% income tax in both. One is $1k cheaper.', hookEs: '0% impuestos en las dos. Una es $1k más barata.', image: 'photo-1512453979798-5ea266f8880c', hot: false },
    { slug: 'buenos-aires-vs-lima', en: 'Buenos Aires vs Lima', es: 'Buenos Aires vs Lima', tag: 'LatAm', tagColor: '#ef4444', cities: ['Buenos Aires', 'Lima'], a: { label: 'Bs As', value: '$900/mo*', win: true }, b: { label: 'Lima', value: '$1,200/mo', win: false }, hook: 'Best food scenes in LatAm. Very different prices.', hookEs: 'Las mejores gastronomías de LatAm. Precios muy distintos.', image: 'photo-1589909202802-8f4aadce9d55', hot: false },
    { slug: 'tokyo-vs-seoul', en: 'Tokyo vs Seoul', es: 'Tokio vs Seúl', tag: 'Asia', tagColor: '#ec4899', cities: ['Tokyo', 'Seoul'], a: { label: 'Tokyo', value: '$2,200/mo', win: false }, b: { label: 'Seoul', value: '$1,700/mo', win: true }, hook: 'Both world-class. One is 25% cheaper.', hookEs: 'Las dos de primer nivel. Una es 25% más barata.', image: 'photo-1540959733332-eab4deabeeaf', hot: false },
    { slug: 'amsterdam-vs-prague', en: 'Amsterdam vs Prague', es: 'Ámsterdam vs Praga', tag: 'Europe', tagColor: '#6366f1', cities: ['Amsterdam', 'Prague'], a: { label: 'Amsterdam', value: '€3,000/mo', win: false }, b: { label: 'Prague', value: '€1,300/mo', win: true }, hook: 'Canals. Beer. Culture. One costs twice the other.', hookEs: 'Canales. Cerveza. Cultura. Una cuesta el doble.', image: 'photo-1512470876302-972faa2aa9a4', hot: false },
    { slug: 'lisbon-vs-tbilisi', en: 'Lisbon vs Tbilisi', es: 'Lisboa vs Tbilisi', tag: 'Visa', tagColor: '#52B788', cities: ['Lisbon', 'Tbilisi'], a: { label: 'Lisbon', value: '€2,000/mo', win: false }, b: { label: 'Tbilisi', value: '$1,000/mo', win: true }, hook: '365-day free stay in Georgia. Half Lisbon\'s cost.', hookEs: '365 días sin visa en Georgia. La mitad de Lisboa.', image: 'photo-1524231757912-21f4fe3a7200', hot: false },
    { slug: 'sydney-vs-melbourne', en: 'Sydney vs Melbourne', es: 'Sydney vs Melbourne', tag: 'Oceania', tagColor: '#0ea5e9', cities: ['Sydney', 'Melbourne'], a: { label: 'Sydney', value: 'A$4,600/mo', win: false }, b: { label: 'Melbourne', value: 'A$3,800/mo', win: true }, hook: 'Beach vs coffee culture. A$800 difference.', hookEs: 'Playa vs cultura cafetera. A$800 de diferencia.', image: 'photo-1506973035872-a4ec16b8e8d9', hot: false },
];

export default function HotTakesPage() {
    const GREEN = '#52B788';
    const hot = TAKES.filter(t => t.hot);
    const rest = TAKES.filter(t => !t.hot);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '3.5rem 0 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                        <div style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Updated April 2026 · Actualizado abril 2026</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 0.625rem', letterSpacing: '-0.04em' }}>Hot Takes</h1>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', margin: '0 0 0.375rem' }}>
                        Real city comparisons. No fluff. Click for the full breakdown.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>
                        Comparaciones reales de ciudades. Sin relleno. Click para el análisis completo.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
                {/* Trending — larger cards */}
                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Trending this week</p>
                <div className="hot-takes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                    {hot.map(t => <TakeCard key={t.slug} take={t} featured />)}
                </div>

                {/* All — compact cards */}
                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>All comparisons · Todas</p>
                <div className="hot-takes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                    {rest.map(t => <TakeCard key={t.slug} take={t} />)}
                </div>

                {/* CTA */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                        Compare any cities — add up to 4
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.45)', margin: '0 0 0.4rem', fontSize: '0.88rem' }}>Your lifestyle. Your budget. Real data.</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0 1.75rem', fontSize: '0.8rem', fontStyle: 'italic' }}>Tu estilo de vida. Tu presupuesto. Datos reales.</p>
                    <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                            Compare cities →
                        </Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                            See rankings →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TakeCard({ take, featured = false }: { take: typeof TAKES[0]; featured?: boolean }) {
    const GREEN = '#52B788';
    return (
        <Link href={`/hot-takes/${take.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: featured ? '2px solid #ef444444' : '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}>
                {/* Image — shorter */}
                <div style={{ height: featured ? '140px' : '110px', overflow: 'hidden', position: 'relative' }}>
                    <img src={`https://images.unsplash.com/${take.image}?auto=format&fit=crop&w=800&h=300&q=80`}
                        alt={take.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: take.tagColor, color: 'white', fontSize: '0.58rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {take.tag}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '0.875rem 1rem' }}>
                    {/* Hook — 1 line */}
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>{take.hook}</p>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.3 }}>{take.hookEs}</p>

                    {/* VS comparison — the money shot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: take.a.win ? '#F0FAF4' : '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem 0.625rem', border: take.a.win ? `1px solid ${GREEN}33` : '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.15rem' }}>{take.a.label}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: take.a.win ? GREEN : '#0f172a' }}>{take.a.value}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#cbd5e1' }}>VS</div>
                        <div style={{ flex: 1, backgroundColor: take.b.win ? '#F0FAF4' : '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem 0.625rem', border: take.b.win ? `1px solid ${GREEN}33` : '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.15rem' }}>{take.b.label}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: take.b.win ? GREEN : '#0f172a' }}>{take.b.value}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '0.625rem', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: take.tagColor }}>Full breakdown →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

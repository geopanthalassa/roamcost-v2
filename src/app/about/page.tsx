import Link from 'next/link';

export const metadata = {
    title: 'About RoamCost | Global Cost of Living Comparisons',
    description: 'RoamCost helps digital nomads, expats and travelers compare cost of living across hundreds of cities worldwide with real, updated data.',
};

export default function AboutPage() {
    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <span style={{ color: '#5b8c71', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Our mission</span>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.05em', marginTop: '0.5rem', lineHeight: 1.1 }}>
                    The world is your home.{' '}
                    <span style={{ color: '#5b8c71' }}>We help you choose where.</span>
                </h1>
            </div>

            {[
                { title: 'What is RoamCost?', content: 'RoamCost is a data-driven platform that helps digital nomads, remote workers, expats and curious travelers compare the real cost of living across cities worldwide. We aggregate data on rent, food, transport, internet speed, safety, healthcare and quality of life — so you can make informed decisions about where to live, work or travel.' },
                { title: 'Our data sources', content: 'Our city data is sourced from publicly available datasets and regularly updated. We combine crowdsourced cost-of-living data, government statistics, and real-time APIs for weather and currency exchange. All data is stored and managed via Supabase. We aim to cover 500+ cities by end of 2026.' },
                { title: 'Travel partnerships', content: 'RoamCost partners with Booking.com, Kiwi.com and Airbnb to help you turn data into action. When you find your ideal city, we make it easy to book your flight, hotel or long-term stay directly from the city page.' },
                { title: 'Built for explorers', content: 'Whether you\'re planning a slow travel adventure, comparing relocation options, or just curious about what life costs in Tokyo vs. Buenos Aires — RoamCost gives you the data to decide with confidence.' },
            ].map(section => (
                <div key={section.title} className="card" style={{ padding: '2.5rem', marginBottom: '1.5rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{section.title}</h2>
                    <p style={{ color: '#475569', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
                </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/compare" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontWeight: 800 }}>
                    Start Comparing →
                </Link>
                <Link href="/contact" style={{ padding: '1rem 2.5rem', fontWeight: 700, color: '#5b8c71', border: '2px solid #5b8c71', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
                    Contact Us
                </Link>
            </div>
        </div>
    );
}

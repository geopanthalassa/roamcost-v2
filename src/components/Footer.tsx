import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', padding: '4rem 0', marginTop: '4rem', backgroundColor: '#f8fafc' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                <div>
                    <h3 style={{ color: '#4ECDC4', marginBottom: '1rem' }}>RoamCost</h3>
                    <p style={{ color: 'var(--muted)', maxWidth: '280px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                        Data-driven insights to help you find your perfect global base. Compare cities, plan your move.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#0f172a' }}>Platform</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><Link href="/rankings/quality" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Quality of Life</Link></li>
                        <li><Link href="/rankings/cheapest" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Cheapest Cities</Link></li>
                        <li><Link href="/rankings/safest" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Safest Cities</Link></li>
                        <li><Link href="/rankings/nomads" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Digital Nomads</Link></li>
                        <li><Link href="/compare" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Compare Cities</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#0f172a' }}>Travel</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Find Hotels</a></li>
                        <li><a href="https://www.kiwi.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Find Flights</a></li>
                        <li><a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Long-term Stays</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#0f172a' }}>Company</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><Link href="/about" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>About Us</Link></li>
                        <li><Link href="/contact" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Contact</Link></li>
                        <li><Link href="/privacy" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                    © {new Date().getFullYear()} RoamCost. Built for explorers.
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    Data updated regularly • Weather via Open-Meteo • Rates via ExchangeRate-API
                </span>
            </div>
        </footer>
    );
}

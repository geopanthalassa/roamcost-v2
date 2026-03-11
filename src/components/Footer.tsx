export default function Footer() {
    return (
        <footer className="footer" style={{ borderTop: '1px solid var(--border)', padding: '4rem 0', marginTop: '4rem', backgroundColor: '#f8fafc' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                <div>
                    <h3 style={{ color: 'var(--secondary)' }}>RoamCost</h3>
                    <p style={{ color: 'var(--muted)', maxWidth: '300px' }}>
                        Helping wanderers find their next home by comparing the world's most vibrant cities.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Platform</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><a href="/rankings" style={{ color: 'var(--muted)' }}>Rankings</a></li>
                        <li><a href="/compare" style={{ color: 'var(--muted)' }}>Compare Cities</a></li>
                        <li><a href="/nomads" style={{ color: 'var(--muted)' }}>Digital Nomads</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Support</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><a href="/about" style={{ color: 'var(--muted)' }}>About Us</a></li>
                        <li><a href="/contact" style={{ color: 'var(--muted)' }}>Contact</a></li>
                        <li><a href="/privacy" style={{ color: 'var(--muted)' }}>Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                &copy; {new Date().getFullYear()} RoamCost. All rights reserved. Built for explorers.
            </div>
        </footer >
    );
}

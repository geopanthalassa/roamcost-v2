import Link from 'next/link';
import Translator from './Translator';

export default function Header() {
    return (
        <header className="header" style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0', position: 'sticky', top: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '-0.02em' }}>
                    RoamCost
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/rankings/cheapest" style={{ fontWeight: 500 }}>Rankings</Link>
                    <Link href="/compare" style={{ fontWeight: 500 }}>Compare</Link>
                    <Link href="/rankings/nomads" style={{ fontWeight: 500 }}>Nomads</Link>
                    <Translator />
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</button>
                </nav>
            </div>
        </header>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import Translator from './Translator';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/rankings/quality', label: 'Rankings' },
    { href: '/rankings/region/europe', label: 'By Region' },
    { href: '/compare', label: 'Compare' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/rankings/nomads', label: 'Nomads' },
    { href: '/about', label: 'About' },
];

export default function Header() {
    const { currency, setCurrency } = useCurrency();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <Image src="/roamcost-logo.png" alt="RoamCost" width={140} height={38} style={{ objectFit: 'contain' }} priority />
                </Link>

                {/* Desktop nav */}
                <nav className="header-nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {NAV_LINKS.map(l => (
                        <Link key={l.href} href={l.href} style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>{l.label}</Link>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
                        <select value={currency} onChange={e => setCurrency(e.target.value as any)}
                            style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}>
                            <option value="USD">🇺🇸 USD</option>
                            <option value="EUR">🇪🇺 EUR</option>
                            <option value="GBP">🇬🇧 GBP</option>
                            <option value="ARS">🇦🇷 ARS</option>
                            <option value="BRL">🇧🇷 BRL</option>
                            <option value="MXN">🇲🇽 MXN</option>
                            <option value="COP">🇨🇴 COP</option>
                            <option value="JPY">🇯🇵 JPY</option>
                        </select>
                        <Translator />
                    </div>
                </nav>

                {/* Mobile: compact currency + hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select value={currency} onChange={e => setCurrency(e.target.value as any)} className="mobile-currency-select"
                        style={{ padding: '0.3rem 0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="ARS">ARS</option>
                        <option value="BRL">BRL</option>
                        <option value="MXN">MXN</option>
                        <option value="COP">COP</option>
                        <option value="JPY">JPY</option>
                    </select>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-hamburger" aria-label="Menu"
                        style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#0f172a', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                        <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#0f172a', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                        <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#0f172a', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)', zIndex: 999, padding: '0.5rem 1.5rem 1rem' }}>
                    {NAV_LINKS.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                            style={{ display: 'block', padding: '0.875rem 0', fontWeight: 700, color: '#0f172a', fontSize: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            {l.label}
                        </Link>
                    ))}
                    <div style={{ paddingTop: '0.875rem' }}><Translator /></div>
                </div>
            )}

            <style jsx global>{`
                @media (max-width: 768px) {
                    .header-nav-links { display: none !important; }
                    .mobile-hamburger { display: flex !important; }
                    .mobile-currency-select { display: block !important; }
                }
                @media (min-width: 769px) {
                    .mobile-hamburger { display: none !important; }
                    .mobile-currency-select { display: none !important; }
                }
            `}</style>
        </header>
    );
}

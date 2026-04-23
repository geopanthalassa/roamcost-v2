'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/rankings/quality', label: 'Rankings' },
    { href: '/compare', label: 'Compare' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/rankings/nomads', label: 'Nomads' },
    { href: '/about', label: 'About' },
];

const CURRENCIES = ['USD','EUR','GBP','JPY','ARS','BRL','MXN','COP','CLP','CAD','AUD','CHF','CNY','INR','SGD','HKD','KRW','TRY','ZAR','AED'];

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
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select value={currency} onChange={e => setCurrency(e.target.value as any)}
                        style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* Mobile hamburger */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="header-hamburger"
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '1rem 1.5rem', backgroundColor: '#fff' }}>
                    {NAV_LINKS.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                            style={{ display: 'block', padding: '0.875rem 0', fontWeight: 700, color: '#0f172a', fontSize: '1rem', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

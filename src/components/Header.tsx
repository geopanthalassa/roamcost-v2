'use client';

import Link from 'next/link';
import Translator from './Translator';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';

export default function Header() {
    const { currency, setCurrency } = useCurrency();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header style={{
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem 0',
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
            zIndex: 100,
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{
                    fontSize: '1.5rem', fontWeight: 900, color: '#0f172a',
                    letterSpacing: '-0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    RoamCost
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Home</Link>
                        <Link href="/rankings/quality" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Rankings</Link>
                        <Link href="/compare" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Compare</Link>
                        <Link href="/calculator" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Calculator</Link>
                        <Link href="/rankings/nomads" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Nomads</Link>
                        <Link href="/about" style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>About</Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            style={{
                                padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)',
                                border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700,
                                color: '#0f172a', backgroundColor: '#ffffff', cursor: 'pointer', outline: 'none'
                            }}
                        >
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
            </div>
        </header>
    );
}

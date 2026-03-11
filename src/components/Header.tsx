'use client';

import Link from 'next/link';
import Translator from './Translator';
import { useCurrency } from '@/context/CurrencyContext';

export default function Header() {
    const { currency, setCurrency } = useCurrency();

    return (
        <header className="header" style={{
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.05)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: 'var(--primary)',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <span style={{ color: 'var(--secondary)' }}>Roam</span>Cost
                </Link>

                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', marginRight: '1rem' }}>
                        <Link href="/rankings/cheapest" className="nav-link" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Rankings</Link>
                        <Link href="/compare" className="nav-link" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Compare</Link>
                        <Link href="/rankings/nomads" className="nav-link" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Nomads</Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            style={{
                                padding: '0.4rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                backgroundColor: 'var(--card)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="ARS">ARS ($)</option>
                            <option value="BRL">BRL (R$)</option>
                        </select>
                        <Translator />
                        <Link href="/rankings/quality" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem' }}>
                            Best Places
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}

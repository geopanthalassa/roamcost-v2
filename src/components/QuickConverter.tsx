'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PAIRS = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'ARS' },
    { from: 'EUR', to: 'BRL' },
    { from: 'USD', to: 'BRL' },
    { from: 'USD', to: 'MXN' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'ARS', 'BRL', 'MXN', 'COP', 'CLP', 'CAD', 'AUD', 'CHF', 'SGD', 'THB'];

const FALLBACK: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150.5,
    ARS: 1050, BRL: 4.95, MXN: 16.8, COP: 4100,
    CLP: 950, CAD: 1.36, AUD: 1.53, CHF: 0.90,
    SGD: 1.34, THB: 35.1,
};

function convert(amount: number, from: string, to: string, rates: Record<string, number>) {
    return (amount / (rates[from] ?? 1)) * (rates[to] ?? 1);
}

function fmt(n: number, code: string) {
    const big = ['JPY', 'ARS', 'COP', 'CLP', 'KRW'];
    return big.includes(code)
        ? Math.round(n).toLocaleString()
        : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function QuickConverter() {
    const [rates, setRates] = useState(FALLBACK);
    const [amount, setAmount] = useState('1000');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || 'ee3d23cb725712d5f230d981';
        fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`)
            .then(r => r.json())
            .then(d => { if (d.conversion_rates) setRates(d.conversion_rates); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const num = parseFloat(amount) || 0;
    const result = convert(num, from, to, rates);
    const rate = convert(1, from, to, rates);

    const swap = () => {
        setFrom(to);
        setTo(from);
    };

    const selectStyle = {
        padding: '0.5rem 0.75rem',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '0.5rem',
        outline: 'none',
        cursor: 'pointer',
        width: '100%',
    } as React.CSSProperties;

    return (
        <section style={{ backgroundColor: '#0f172a', padding: '2.5rem 0' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
                        Live Exchange Rates
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                        Quick Currency Converter
                    </h2>
                </div>

                {/* Converter box */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem' }}>

                    {/* Main row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'end', marginBottom: '1.25rem' }}>
                        {/* From */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Swap button */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                            <button onClick={swap} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#52B788', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                                </svg>
                            </button>
                        </div>

                        {/* Result */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Result</label>
                            <div style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1.3rem', fontWeight: 800, color: '#52B788', backgroundColor: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0.75rem', boxSizing: 'border-box' }}>
                                {fmt(result, to)}
                            </div>
                        </div>
                    </div>

                    {/* Currency selects */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
                            {CURRENCIES.map(c => <option key={c} value={c} style={{ color: '#0f172a' }}>{c}</option>)}
                        </select>
                        <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>→</div>
                        <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
                            {CURRENCIES.map(c => <option key={c} value={c} style={{ color: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>

                    {/* Rate info */}
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                            1 {from} = <strong style={{ color: '#ffffff' }}>{fmt(rate, to)} {to}</strong>
                            {loading ? ' · Loading...' : ' · Live rate'}
                        </span>
                    </div>

                    {/* Popular pairs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        {PAIRS.map(p => (
                            <button key={`${p.from}-${p.to}`} onClick={() => { setFrom(p.from); setTo(p.to); }}
                                style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: '2rem', border: `1px solid ${from === p.from && to === p.to ? '#52B788' : 'rgba(255,255,255,0.15)'}`, backgroundColor: from === p.from && to === p.to ? 'rgba(82,183,136,0.15)' : 'transparent', color: from === p.from && to === p.to ? '#52B788' : '#94a3b8', cursor: 'pointer' }}>
                                {p.from}/{p.to}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/calculator" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F7831E', color: '#ffffff', padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                            Full calculator →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

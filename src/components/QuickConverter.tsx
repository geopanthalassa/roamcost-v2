'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PAIRS = [
    { from: 'USD', to: 'EUR', symFrom: '$', symTo: '€' },
    { from: 'USD', to: 'GBP', symFrom: '$', symTo: '£' },
    { from: 'EUR', to: 'GBP', symFrom: '€', symTo: '£' },
    { from: 'USD', to: 'JPY', symFrom: '$', symTo: '¥' },
    { from: 'USD', to: 'ARS', symFrom: '$', symTo: 'AR$' },
    { from: 'EUR', to: 'BRL', symFrom: '€', symTo: 'R$' },
];

const FALLBACK: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150.5,
    ARS: 1050, BRL: 4.95, MXN: 16.8,
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

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || 'ee3d23cb725712d5f230d981';
        fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`)
            .then(r => r.json())
            .then(d => { if (d.conversion_rates) setRates(d.conversion_rates); })
            .catch(() => {});
    }, []);

    const num = parseFloat(amount) || 0;
    const result = convert(num, from, to, rates);
    const rate = convert(1, from, to, rates);

    const symFrom = PAIRS.find(p => p.from === from)?.symFrom ?? from;
    const symTo = PAIRS.find(p => p.to === to)?.symTo ?? to;

    return (
        <section style={{ backgroundColor: '#0f172a', padding: '2rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div className="quick-converter-inner" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Label */}
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Quick Convert</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Live rates</div>
                    </div>

                    <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                    {/* Amount input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' }}>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            style={{
                                width: '110px', padding: '0.5rem 0.75rem',
                                fontSize: '1.1rem', fontWeight: 800, color: '#ffffff',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '0.5rem', outline: 'none',
                            }}
                        />
                        <select
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            style={{
                                padding: '0.5rem 0.6rem', fontSize: '0.85rem', fontWeight: 700,
                                color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '0.5rem', outline: 'none', cursor: 'pointer',
                            }}
                        >
                            {Object.keys(FALLBACK).map(c => <option key={c} value={c} style={{ color: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>

                    {/* Arrow */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8833a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>

                    {/* Result */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' }}>
                        <div style={{
                            padding: '0.5rem 0.75rem', fontSize: '1.1rem', fontWeight: 800,
                            color: '#5b8c71', backgroundColor: 'rgba(91,140,113,0.15)',
                            border: '1px solid rgba(91,140,113,0.3)',
                            borderRadius: '0.5rem', minWidth: '110px',
                        }}>
                            {fmt(result, to)}
                        </div>
                        <select
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            style={{
                                padding: '0.5rem 0.6rem', fontSize: '0.85rem', fontWeight: 700,
                                color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '0.5rem', outline: 'none', cursor: 'pointer',
                            }}
                        >
                            {Object.keys(FALLBACK).map(c => <option key={c} value={c} style={{ color: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>

                    <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                    {/* Rate info */}
                    <div style={{ flex: 1, minWidth: '140px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Exchange rate</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
                            1 {from} = <span style={{ color: '#ffffff' }}>{fmt(rate, to)} {to}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link href="/calculator" style={{
                        flexShrink: 0, padding: '0.5rem 1.25rem',
                        backgroundColor: '#e8833a', color: '#ffffff',
                        borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem',
                        textDecoration: 'none', whiteSpace: 'nowrap',
                    }}>
                        Full calculator →
                    </Link>
                </div>
            </div>
        </section>
    );
}

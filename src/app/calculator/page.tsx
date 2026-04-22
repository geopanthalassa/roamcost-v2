'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
    { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', flag: '🇦🇷' },
    { code: 'COP', name: 'Colombian Peso', symbol: 'CO$', flag: '🇨🇴' },
    { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$', flag: '🇨🇱' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
];

const FALLBACK_RATES: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150.5, AUD: 1.53, CAD: 1.36,
    CHF: 0.90, CNY: 7.24, INR: 83.1, BRL: 4.95, MXN: 16.8, ARS: 1050,
    COP: 4100, CLP: 950, KRW: 1330, SGD: 1.34, THB: 35.1, TRY: 32.5,
    PLN: 3.98, ZAR: 18.6, AED: 3.67, SAR: 3.75, IDR: 15750, MYR: 4.72,
    PHP: 56.2, VND: 24800, HKD: 7.82, NZD: 1.63, NOK: 10.6, SEK: 10.4,
    DKK: 6.89, UAH: 38.5, UYU: 39.5, PEN: 3.73,
};

const POPULAR_PAIRS = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'ARS' },
    { from: 'EUR', to: 'BRL' },
];

const BIG = ['JPY', 'KRW', 'IDR', 'VND', 'CLP', 'COP', 'ARS'];

function fmt(value: number, code: string): string {
    if (!isFinite(value)) return '';
    if (BIG.includes(code)) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function doConvert(amount: number, from: string, to: string, rates: Record<string, number>): number {
    const fromRate = rates[from] ?? FALLBACK_RATES[from] ?? 1;
    const toRate = rates[to] ?? FALLBACK_RATES[to] ?? 1;
    return (amount / fromRate) * toRate;
}

export default function CalculatorPage() {
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');
    const [fromCode, setFromCode] = useState('USD');
    const [toCode, setToCode] = useState('EUR');
    const [fromAmount, setFromAmount] = useState(1000);
    const [toAmount, setToAmount] = useState(0);
    const direction = useRef<'from' | 'to'>('from');

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || 'ee3d23cb725712d5f230d981';
        fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`)
            .then(r => r.json())
            .then(d => {
                if (d.conversion_rates) {
                    setRates(d.conversion_rates);
                    setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Recompute whenever inputs or rates change
    useEffect(() => {
        if (direction.current === 'from') {
            setToAmount(doConvert(fromAmount, fromCode, toCode, rates));
        } else {
            setFromAmount(doConvert(toAmount, toCode, fromCode, rates));
        }
    }, [fromAmount, toAmount, fromCode, toCode, rates]);

    const handleFromChange = (val: string) => {
        direction.current = 'from';
        const n = parseFloat(val);
        setFromAmount(isNaN(n) ? 0 : n);
        setToAmount(doConvert(isNaN(n) ? 0 : n, fromCode, toCode, rates));
    };

    const handleToChange = (val: string) => {
        direction.current = 'to';
        const n = parseFloat(val);
        setToAmount(isNaN(n) ? 0 : n);
        setFromAmount(doConvert(isNaN(n) ? 0 : n, toCode, fromCode, rates));
    };

    const swap = () => {
        const prevFrom = fromCode;
        const prevTo = toCode;
        setFromCode(prevTo);
        setToCode(prevFrom);
        direction.current = 'from';
        setToAmount(doConvert(fromAmount, prevTo, prevFrom, rates));
    };

    const rate = doConvert(1, fromCode, toCode, rates);
    const toCurr = CURRENCIES.find(c => c.code === toCode)!;

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '1rem 1.25rem', fontSize: '1.5rem', fontWeight: 700,
        color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: '0.75rem',
        outline: 'none', backgroundColor: '#ffffff', boxSizing: 'border-box',
    };

    const selectStyle: React.CSSProperties = {
        padding: '0.75rem 2.5rem 0.75rem 1rem', fontSize: '0.95rem', fontWeight: 700,
        color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: '0.75rem',
        backgroundColor: '#ffffff', cursor: 'pointer', outline: 'none', width: '100%',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 12px) center',
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Hero */}
            <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '4rem 0 3rem' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2rem', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b8c71' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Exchange Rates</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>Currency Converter</h1>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Real-time exchange rates for travelers, nomads and expats. Convert between 35+ currencies instantly.
                    </p>
                </div>
            </section>

            {/* Converter */}
            <section style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}>
                    {/* FROM */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>From</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem' }}>
                            <input
                                type="number"
                                value={fromAmount || ''}
                                onChange={e => handleFromChange(e.target.value)}
                                style={inputStyle}
                                placeholder="0"
                            />
                            <select value={fromCode} onChange={e => { direction.current = 'from'; setFromCode(e.target.value); }} style={selectStyle}>
                                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Swap */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                        <button onClick={swap} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b8c71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                            </svg>
                        </button>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                    </div>

                    {/* TO */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>To</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem' }}>
                            <input
                                type="number"
                                value={toAmount || ''}
                                onChange={e => handleToChange(e.target.value)}
                                style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#5b8c71' }}
                                placeholder="0"
                            />
                            <select value={toCode} onChange={e => { direction.current = 'from'; setToCode(e.target.value); }} style={selectStyle}>
                                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Rate info */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Exchange Rate</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                1 {fromCode} = <span style={{ color: '#5b8c71' }}>{fmt(rate, toCode)} {toCode}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                {loading ? 'Loading rates...' : lastUpdated ? `Updated ${lastUpdated}` : 'Fallback rates'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                1 {toCode} = {fmt(1 / rate, fromCode)} {fromCode}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular pairs */}
                <div style={{ marginTop: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular Pairs</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {POPULAR_PAIRS.map(pair => {
                            const r = doConvert(1, pair.from, pair.to, rates);
                            const sym = CURRENCIES.find(c => c.code === pair.to)?.symbol ?? '';
                            const active = fromCode === pair.from && toCode === pair.to;
                            return (
                                <button key={`${pair.from}-${pair.to}`}
                                    onClick={() => { direction.current = 'from'; setFromCode(pair.from); setToCode(pair.to); setToAmount(doConvert(fromAmount, pair.from, pair.to, rates)); }}
                                    style={{ backgroundColor: active ? '#f0fdf4' : '#ffffff', border: `2px solid ${active ? '#5b8c71' : '#e2e8f0'}`, borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{pair.from} → {pair.to}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#5b8c71', fontWeight: 700 }}>{fmt(r, pair.to)} {sym}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: '2.5rem', backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Going somewhere?</div>
                    <h3 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', margin: '0 0 0.75rem' }}>Compare the full cost of living</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Rent, food, safety, internet — not just exchange rates.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{ backgroundColor: '#5b8c71', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Compare Cities</Link>
                        <Link href="/rankings/cheapest" style={{ backgroundColor: 'transparent', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid #334155' }}>Cheapest Cities</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

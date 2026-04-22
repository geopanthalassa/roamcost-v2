'use client';

import { useState, useEffect, useCallback } from 'react';
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
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
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
];

const FALLBACK_RATES: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150.5, AUD: 1.53, CAD: 1.36,
    CHF: 0.90, CNY: 7.24, INR: 83.1, BRL: 4.95, MXN: 16.8, ARS: 1050,
    COP: 4100, CLP: 950, KRW: 1330, SGD: 1.34, THB: 35.1, TRY: 32.5,
    PLN: 3.98, CZK: 23.1, HUF: 357, RON: 4.58, ZAR: 18.6, AED: 3.67,
    SAR: 3.75, IDR: 15750, MYR: 4.72, PHP: 56.2, VND: 24800, HKD: 7.82,
    NZD: 1.63, NOK: 10.6, SEK: 10.4, DKK: 6.89, UAH: 38.5,
};

const POPULAR_PAIRS = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'ARS' },
    { from: 'EUR', to: 'BRL' },
];

function formatAmount(value: number, code: string): string {
    const bigCurrencies = ['JPY', 'KRW', 'IDR', 'VND', 'HUF', 'CLP', 'COP', 'ARS'];
    if (bigCurrencies.includes(code)) {
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CalculatorPage() {
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const [fromCode, setFromCode] = useState('USD');
    const [toCode, setToCode] = useState('EUR');
    const [fromAmount, setFromAmount] = useState('1000');
    const [toAmount, setToAmount] = useState('');
    const [activeField, setActiveField] = useState<'from' | 'to'>('from');

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || 'ee3d23cb725712d5f230d981';
        fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
            .then(r => r.json())
            .then(data => {
                if (data.conversion_rates) {
                    setRates(data.conversion_rates);
                    setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const convert = useCallback((amount: number, from: string, to: string) => {
        const fromRate = rates[from] ?? FALLBACK_RATES[from] ?? 1;
        const toRate = rates[to] ?? FALLBACK_RATES[to] ?? 1;
        return (amount / fromRate) * toRate;
    }, [rates]);

    useEffect(() => {
        if (activeField === 'from') {
            const num = parseFloat(fromAmount);
            if (!isNaN(num)) {
                setToAmount(formatAmount(convert(num, fromCode, toCode), toCode));
            } else {
                setToAmount('');
            }
        }
    }, [fromAmount, fromCode, toCode, convert, activeField]);

    useEffect(() => {
        if (activeField === 'to') {
            const num = parseFloat(toAmount.replace(/,/g, ''));
            if (!isNaN(num)) {
                setFromAmount(formatAmount(convert(num, toCode, fromCode), fromCode));
            } else {
                setFromAmount('');
            }
        }
    }, [toAmount, toCode, fromCode, convert, activeField]);

    const swap = () => {
        setFromCode(toCode);
        setToCode(fromCode);
        setFromAmount(toAmount.replace(/,/g, ''));
        setActiveField('from');
    };

    const rate = convert(1, fromCode, toCode);
    const fromCurrency = CURRENCIES.find(c => c.code === fromCode)!;
    const toCurrency = CURRENCIES.find(c => c.code === toCode)!;

    const inputStyle = {
        width: '100%',
        padding: '1rem 1.25rem',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#0f172a',
        border: '2px solid #e2e8f0',
        borderRadius: '0.75rem',
        outline: 'none',
        backgroundColor: '#ffffff',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box' as const,
    };

    const selectStyle = {
        padding: '0.75rem 1rem',
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#0f172a',
        border: '2px solid #e2e8f0',
        borderRadius: '0.75rem',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        outline: 'none',
        width: '100%',
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'calc(100% - 12px) center',
        paddingRight: '2.5rem',
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* Hero */}
            <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '4rem 0 3rem' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2rem', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b8c71' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Live Exchange Rates
                        </span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                        Currency Converter
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Real-time exchange rates for travelers, nomads and expats. Convert between 35+ currencies instantly.
                    </p>
                </div>
            </section>

            {/* Main converter */}
            <section style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}>

                    {/* FROM */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                            From
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '0.75rem' }}>
                            <input
                                type="number"
                                value={fromAmount}
                                onChange={e => { setActiveField('from'); setFromAmount(e.target.value); }}
                                onFocus={() => setActiveField('from')}
                                style={inputStyle}
                                placeholder="0"
                            />
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={fromCode}
                                    onChange={e => setFromCode(e.target.value)}
                                    style={selectStyle}
                                >
                                    {CURRENCIES.map(c => (
                                        <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Swap button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                        <button
                            onClick={swap}
                            style={{
                                width: '44px', height: '44px', borderRadius: '50%',
                                border: '2px solid #e2e8f0', backgroundColor: '#ffffff',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', transition: 'all 0.2s', flexShrink: 0,
                            }}
                            title="Swap currencies"
                        >
                            ⇅
                        </button>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                    </div>

                    {/* TO */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                            To
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '0.75rem' }}>
                            <input
                                type="number"
                                value={toAmount}
                                onChange={e => { setActiveField('to'); setToAmount(e.target.value); }}
                                onFocus={() => setActiveField('to')}
                                style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#5b8c71' }}
                                placeholder="0"
                            />
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={toCode}
                                    onChange={e => setToCode(e.target.value)}
                                    style={selectStyle}
                                >
                                    {CURRENCIES.map(c => (
                                        <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Rate display */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                                Exchange Rate
                            </div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                1 {fromCode} = {fromCurrency.symbol}{' '}
                                <span style={{ color: '#5b8c71' }}>
                                    {formatAmount(rate, toCode)} {toCode}
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                {loading ? 'Loading rates...' : lastUpdated ? `Updated ${lastUpdated}` : 'Fallback rates'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                1 {toCode} = {formatAmount(1 / rate, fromCode)} {fromCode}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular pairs */}
                <div style={{ marginTop: '2.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Popular Pairs
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {POPULAR_PAIRS.map(pair => {
                            const r = convert(1, pair.from, pair.to);
                            const toCurr = CURRENCIES.find(c => c.code === pair.to)!;
                            return (
                                <button
                                    key={`${pair.from}-${pair.to}`}
                                    onClick={() => { setFromCode(pair.from); setToCode(pair.to); setActiveField('from'); }}
                                    style={{
                                        backgroundColor: fromCode === pair.from && toCode === pair.to ? '#f0fdf4' : '#ffffff',
                                        border: fromCode === pair.from && toCode === pair.to ? '2px solid #5b8c71' : '2px solid #e2e8f0',
                                        borderRadius: '0.75rem', padding: '1rem',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                    }}
                                >
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                                        {pair.from} → {pair.to}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#5b8c71', fontWeight: 700 }}>
                                        {formatAmount(r, pair.to)} {toCurr.symbol}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CTA to compare cities */}
                <div style={{ marginTop: '2.5rem', backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        Going somewhere?
                    </div>
                    <h3 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', margin: '0 0 0.75rem' }}>
                        Compare the full cost of living
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Rent, food, safety, internet — not just exchange rates.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/compare" style={{
                            backgroundColor: '#5b8c71', color: '#ffffff',
                            padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                        }}>
                            Compare Cities
                        </Link>
                        <Link href="/rankings/cheapest" style={{
                            backgroundColor: 'transparent', color: '#ffffff',
                            padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                            border: '1px solid #334155',
                        }}>
                            Cheapest Cities
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

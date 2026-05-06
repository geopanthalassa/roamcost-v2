'use client';

import { useState, useEffect } from 'react';

const FALLBACK: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, JPY: 150.5, AUD: 1.53, CAD: 1.36,
  CHF: 0.90, CNY: 7.24, INR: 83.1, BRL: 4.95, MXN: 16.8, ARS: 1050,
  COP: 4100, CLP: 950, KRW: 1330, SGD: 1.34, THB: 35.1, TRY: 32.5,
  PLN: 3.98, ZAR: 18.6, AED: 3.67, SAR: 3.75, IDR: 15750, MYR: 4.72,
  PHP: 56.2, VND: 24800, HKD: 7.82, NZD: 1.63, NOK: 10.6, SEK: 10.4,
  DKK: 6.89, UAH: 38.5, UYU: 39.5, PEN: 3.73,
};

const BIG = ['JPY', 'KRW', 'IDR', 'VND', 'CLP', 'COP', 'ARS'];

function fmt(v: number, code: string) {
  if (!isFinite(v)) return '0';
  if (BIG.includes(code)) return Math.round(v).toLocaleString();
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function convert(amount: number, from: string, to: string, rates: Record<string, number>) {
  return (amount / (rates[from] ?? 1)) * (rates[to] ?? 1);
}

interface Props {
  from: string;
  to: string;
  currencies: Record<string, { name: string; symbol: string }>;
}

export default function ConvertClient({ from, to, currencies }: Props) {
  const [rates, setRates] = useState(FALLBACK);
  const [amount, setAmount] = useState(1000);
  const [lastUpdated, setLastUpdated] = useState('');

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
      .catch(() => {});
  }, []);

  const result = convert(amount, from, to, rates);
  const rate = convert(1, from, to, rates);
  const inverseRate = convert(1, to, from, rates);

  // Common amounts
  const commonAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <section style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 1.5rem' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '1.5rem' }}>

        {/* Main converter */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
              {from} — {currencies[from]?.name}
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '0.875rem 1rem', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
              {to} — {currencies[to]?.name}
            </label>
            <div style={{ width: '100%', padding: '0.875rem 1rem', fontSize: '1.4rem', fontWeight: 700, color: '#52B788', border: '2px solid #D8F3DC', borderRadius: '0.75rem', backgroundColor: '#F0FAF4', boxSizing: 'border-box' }}>
              {fmt(result, to)}
            </div>
          </div>
        </div>

        {/* Rate info */}
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              1 {from} = <span style={{ color: '#52B788' }}>{fmt(rate, to)} {to}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              1 {to} = {fmt(inverseRate, from)} {from}
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            {lastUpdated ? `Updated ${lastUpdated}` : 'Live rates'}
          </div>
        </div>

        {/* Common amounts */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Quick convert</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {commonAmounts.map(a => (
              <button key={a} onClick={() => setAmount(a)}
                style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '2rem', border: `1px solid ${amount === a ? '#52B788' : '#e2e8f0'}`, backgroundColor: amount === a ? '#F0FAF4' : '#ffffff', color: amount === a ? '#52B788' : '#475569', cursor: 'pointer' }}>
                {a.toLocaleString()} {from} = {fmt(convert(a, from, to, rates), to)} {to}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

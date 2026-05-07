import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ConvertClient from './ConvertClient';

const CURRENCIES: Record<string, { name: string; symbol: string }> = {
  USD: { name: 'US Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF' },
  CNY: { name: 'Chinese Yuan', symbol: '¥' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
  BRL: { name: 'Brazilian Real', symbol: 'R$' },
  MXN: { name: 'Mexican Peso', symbol: 'MX$' },
  ARS: { name: 'Argentine Peso', symbol: 'AR$' },
  COP: { name: 'Colombian Peso', symbol: 'CO$' },
  CLP: { name: 'Chilean Peso', symbol: 'CL$' },
  KRW: { name: 'South Korean Won', symbol: '₩' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$' },
  THB: { name: 'Thai Baht', symbol: '฿' },
  TRY: { name: 'Turkish Lira', symbol: '₺' },
  PLN: { name: 'Polish Zloty', symbol: 'zł' },
  ZAR: { name: 'South African Rand', symbol: 'R' },
  AED: { name: 'UAE Dirham', symbol: 'AED' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM' },
  PHP: { name: 'Philippine Peso', symbol: '₱' },
  VND: { name: 'Vietnamese Dong', symbol: '₫' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr' },
  SEK: { name: 'Swedish Krona', symbol: 'kr' },
  DKK: { name: 'Danish Krone', symbol: 'kr' },
  UAH: { name: 'Ukrainian Hryvnia', symbol: '₴' },
  UYU: { name: 'Uruguayan Peso', symbol: '$U' },
  PEN: { name: 'Peruvian Sol', symbol: 'S/' },
  SAR: { name: 'Saudi Riyal', symbol: 'SAR' },
};

function parsePair(slug: string): { from: string; to: string } | null {
  const match = slug.match(/^([a-z]{3})-to-([a-z]{3})$/i);
  if (!match) return null;
  const from = match[1].toUpperCase();
  const to = match[2].toUpperCase();
  if (!CURRENCIES[from] || !CURRENCIES[to]) return null;
  return { from, to };
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: 'Currency Converter | RoamCost' };
  const { from, to } = parsed;
  const fromName = CURRENCIES[from].name;
  const toName = CURRENCIES[to].name;
  const title = `${from} to ${to} Converter – ${fromName} to ${toName} | RoamCost`;
  const description = `Convert ${fromName} to ${toName} with live exchange rates. How much is 1 ${from} in ${to} today? Free ${from}/${to} currency converter updated daily.`;
  return {
    title,
    description,
    openGraph: { title, description, url: `https://www.roamcost.com/convert/${pair}` },
    alternates: { canonical: `https://www.roamcost.com/convert/${pair}` },
    keywords: `${from} to ${to}, ${from} ${to} converter, ${fromName} to ${toName}, ${from} ${to} exchange rate, convert ${from} to ${to} today`,
  };
}

export default async function ConvertPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const { from, to } = parsed;
  const fromCurr = CURRENCIES[from];
  const toCurr = CURRENCIES[to];

  const relatedPairs = Object.keys(CURRENCIES)
    .filter(c => c !== from && c !== to)
    .slice(0, 8)
    .map(c => ({ from, to: c }));

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: `${from} to ${to} Converter`,
        description: `Convert ${fromCurr.name} to ${toCurr.name} with live exchange rates`,
        url: `https://www.roamcost.com/convert/${pair}`,
        applicationCategory: 'FinanceApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      })}} />

      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '3rem 0 2.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <nav style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>→</span>
            <Link href="/calculator" style={{ color: '#94a3b8', textDecoration: 'none' }}>Currency Converter</Link>
            <span style={{ margin: '0 0.5rem' }}>→</span>
            <span style={{ color: '#0f172a' }}>{from} to {to}</span>
          </nav>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            {from} to {to} Converter
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
            Convert {fromCurr.name} to {toCurr.name} with live exchange rates. Updated daily for travelers, expats and digital nomads.
          </p>
        </div>
      </section>

      <ConvertClient from={from} to={to} currencies={CURRENCIES} />

      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            About {from} to {to} conversion
          </h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.75 }}>
            The {fromCurr.name} ({from}) and the {toCurr.name} ({to}) are widely traded currencies used by travelers, expats and investors worldwide.
            Exchange rates fluctuate daily based on economic conditions, interest rates, and market sentiment.
            RoamCost uses live rates updated daily to give you the most accurate {from}/{to} conversion.
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Other {from} conversions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {relatedPairs.map(p => (
              <Link key={p.to} href={`/convert/${p.from.toLowerCase()}-to-${p.to.toLowerCase()}`}
                style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.35rem 0.875rem', borderRadius: '2rem', backgroundColor: '#f8fafc', color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                {p.from} → {p.to}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.3rem', margin: '0 0 0.5rem' }}>
            Going somewhere that uses {to}?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Compare the full cost of living — rent, food, safety and internet — not just the exchange rate.
          </p>
          <Link href="/compare" style={{ backgroundColor: '#52B788', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            Compare cities →
          </Link>
        </div>
      </section>
    </div>
  );
}

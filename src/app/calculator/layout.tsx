import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Currency Converter — Live Exchange Rates 2026 | RoamCost',
    description: 'Convert between 35+ currencies with live exchange rates. USD to EUR, GBP, JPY, ARS, BRL and more. Free currency calculator for travelers, digital nomads and expats.',
    keywords: 'currency converter, exchange rates, USD to EUR, USD to GBP, live exchange rates, currency calculator, travel money converter',
    openGraph: {
        title: 'Currency Converter — Live Exchange Rates | RoamCost',
        description: 'Convert between 35+ currencies instantly. Live rates updated daily.',
        url: 'https://www.roamcost.com/calculator',
        siteName: 'RoamCost',
        type: 'website',
    },
    alternates: { canonical: 'https://www.roamcost.com/calculator' },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

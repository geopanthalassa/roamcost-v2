import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Currency Converter | RoamCost',
    description: 'Convert between 35+ currencies with live exchange rates. Built for travelers, digital nomads and expats.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

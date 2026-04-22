'use client';
// Tiny client component used inside server-rendered city pages
// to show live currency conversion without making the whole page client-side
import { useCurrency } from '@/context/CurrencyContext';

interface Props {
    usdAmount: number;
    large?: boolean;
}

export default function CurrencyDisplay({ usdAmount, large }: Props) {
    const { formatValue, currency } = useCurrency();
    if (currency === 'USD') return null;
    return (
        <div style={{
            fontSize: large ? '0.9rem' : '0.75rem',
            color: '#52B788', fontWeight: 600, marginTop: '1px'
        }}>
            ≈ {formatValue(usdAmount)}
        </div>
    );
}

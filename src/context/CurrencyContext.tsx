'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'ARS' | 'BRL' | 'MXN' | 'JPY';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    formatValue: (value: number) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const symbolMap: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    ARS: 'AR$',
    BRL: 'R$',
    MXN: 'MX$',
    JPY: '¥',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRate, setExchangeRate] = useState(1);

    // In a real app, we'd fetch this from an API. For now, we'll use static rates
    // that the user can later connect to their ExchangeRate API key.
    useEffect(() => {
        const rates: Record<Currency, number> = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.78,
            ARS: 845,
            BRL: 4.95,
            MXN: 16.8,
            JPY: 150.5,
        };
        setExchangeRate(rates[currency]);
    }, [currency]);

    const formatValue = (value: number) => {
        const converted = value * exchangeRate;
        return `${symbolMap[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatValue, exchangeRate }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};

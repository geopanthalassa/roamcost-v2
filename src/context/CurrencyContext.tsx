'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'ARS' | 'BRL' | 'MXN' | 'JPY' | 'COP' | 'CLP';

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
    COP: 'CO$',
    CLP: 'CL$',
};

// Fallback static rates in case API fails
const fallbackRates: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    ARS: 1050,
    BRL: 4.95,
    MXN: 16.8,
    JPY: 150.5,
    COP: 4100,
    CLP: 950,
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [rates, setRates] = useState<Record<string, number>>(fallbackRates);

    // Fetch live rates once on mount using the ExchangeRate API key from env
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || 'ee3d23cb725712d5f230d981';
        fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
            .then(r => r.json())
            .then(data => {
                if (data.conversion_rates) {
                    setRates(data.conversion_rates);
                }
            })
            .catch(() => {
                // Keep fallback rates on error
            });
    }, []);

    useEffect(() => {
        setExchangeRate(rates[currency] ?? fallbackRates[currency] ?? 1);
    }, [currency, rates]);

    const formatValue = (value: number) => {
        const converted = value * exchangeRate;
        const sym = symbolMap[currency];
        if (['ARS', 'COP', 'CLP', 'JPY'].includes(currency)) {
            return `${sym}${Math.round(converted).toLocaleString()}`;
        }
        return `${sym}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
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

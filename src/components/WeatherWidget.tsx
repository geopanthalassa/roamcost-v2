'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
        apparent_temperature: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        weather_code: number[];
        time: string[];
    };
}

interface Props {
    lat: number;
    long: number;
    city: string;
}

function getWeatherDesc(code: number): { label: string; color: string } {
    if (code === 0) return { label: 'Clear sky', color: '#F7831E' };
    if (code <= 2) return { label: 'Partly cloudy', color: '#94a3b8' };
    if (code === 3) return { label: 'Overcast', color: '#94a3b8' };
    if (code <= 49) return { label: 'Foggy', color: '#94a3b8' };
    if (code <= 67) return { label: 'Rain', color: '#3b82f6' };
    if (code <= 77) return { label: 'Snow', color: '#93c5fd' };
    if (code <= 99) return { label: 'Thunderstorm', color: '#F7831E' };
    return { label: 'Unknown', color: '#94a3b8' };
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SunIcon = ({ color = '#F7831E' }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const CloudIcon = ({ color = '#94a3b8' }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
);

const RainIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
    </svg>
);

const BoltIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);

function WeatherIcon({ code, size = 18 }: { code: number; size?: number }) {
    if (code === 0) return <SunIcon color="#F7831E" />;
    if (code <= 3) return <CloudIcon />;
    if (code <= 67) return <RainIcon />;
    if (code <= 99) return <BoltIcon />;
    return <CloudIcon />;
}

export default function WeatherWidget({ lat, long, city }: Props) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!lat || !long) { setLoading(false); return; }
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
            `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
            `&timezone=auto&forecast_days=7`
        )
            .then(r => r.json())
            .then(d => { setWeather(d); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, [lat, long]);

    if (loading) return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Loading weather...</div>
        </div>
    );

    if (error || !weather?.current) return null;

    const cur = weather.current;
    const daily = weather.daily;
    const { label } = getWeatherDesc(cur.weather_code);

    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <SunIcon color="#F7831E" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Weather in {city}</h2>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: 'auto', fontWeight: 500 }}>Live · Open-Meteo</span>
            </div>

            {/* Current */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{Math.round(cur.temperature_2m)}°C</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.25rem' }}>Feels {Math.round(cur.apparent_temperature)}°C</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <WeatherIcon code={cur.weather_code} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                            💧 {cur.relative_humidity_2m}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                            💨 {Math.round(cur.wind_speed_10m)} km/h
                        </span>
                    </div>
                </div>
            </div>

            {/* 7-day forecast */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                {daily.time.slice(0, 7).map((date, i) => {
                    const d = new Date(date);
                    const dayName = i === 0 ? 'Today' : DAYS[d.getDay()];
                    return (
                        <div key={date} style={{
                            textAlign: 'center', padding: '0.5rem 0.1rem',
                            backgroundColor: i === 0 ? '#f0fdfc' : '#f8fafc',
                            borderRadius: '0.5rem',
                            border: i === 0 ? '1px solid #b2f0ec' : '1px solid transparent'
                        }}>
                            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: i === 0 ? '#2BC0B4' : '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{dayName}</div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
                                <WeatherIcon code={daily.weather_code[i]} size={14} />
                            </div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a' }}>{Math.round(daily.temperature_2m_max[i])}°</div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{Math.round(daily.temperature_2m_min[i])}°</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

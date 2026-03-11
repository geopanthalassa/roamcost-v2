'use client';

import { useState, useEffect } from 'react';

interface WeatherProps {
    lat: number;
    lng: number;
    cityName: string;
}

export default function WeatherWidget({ lat, lng, cityName }: WeatherProps) {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
                const data = await res.json();
                setWeather(data.current_weather);
            } catch (e) {
                console.error('Weather error:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [lat, lng]);

    if (loading) return <div className="animate-pulse" style={{ height: '100px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-md)' }} />;
    if (!weather) return null;

    return (
        <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>
                {weather.temperature > 25 ? '☀️' : weather.temperature > 15 ? '⛅' : '☁️'}
            </div>
            <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Current Weather</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{weather.temperature}°C</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Wind: {weather.windspeed} km/h</div>
            </div>
        </div>
    );
}

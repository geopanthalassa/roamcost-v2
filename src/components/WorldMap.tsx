'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface MapCity {
    city: string;
    country: string;
    slug: string;
    lat: number;
    long: number;
    cost_index: number;
    rent_index: number;
}

interface WorldMapProps {
    cities: MapCity[];
}

function getCostColor(cost: number): string {
    // Green (cheap) → Orange → Red (expensive)
    if (cost <= 0) return '#94a3b8';
    if (cost < 200) return '#22c55e';   // very cheap
    if (cost < 400) return '#4ECDC4';   // cheap
    if (cost < 600) return '#F7931E';   // medium
    if (cost < 800) return '#ef4444';   // expensive
    return '#b91c1c';                    // very expensive
}

function getCostLabel(cost: number): string {
    if (cost <= 0) return 'No data';
    if (cost < 200) return 'Very affordable';
    if (cost < 400) return 'Affordable';
    if (cost < 600) return 'Moderate';
    if (cost < 800) return 'Expensive';
    return 'Very expensive';
}

export default function WorldMap({ cities }: WorldMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Dynamically load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            const L = (window as any).L;
            if (!mapRef.current) return;

            const map = L.map(mapRef.current, {
                center: [25, 10],
                zoom: 2,
                zoomControl: true,
                scrollWheelZoom: false,
            });

            mapInstance.current = map;

            // Dark/clean tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(map);

            // Add city markers
            cities.forEach(city => {
                if (!city.lat || !city.long) return;

                const color = getCostColor(city.cost_index);
                const label = getCostLabel(city.cost_index);
                const monthly = city.rent_index > 0
                    ? `$${Math.round(city.rent_index * 10).toLocaleString()}/mo est.`
                    : 'Cost data unavailable';

                const marker = L.circleMarker([city.lat, city.long], {
                    radius: 7,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 1.5,
                    opacity: 1,
                    fillOpacity: 0.85,
                });

                marker.bindPopup(`
                    <div style="font-family: system-ui, sans-serif; min-width: 160px;">
                        <div style="font-weight: 900; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;">${city.city}</div>
                        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 8px;">${city.country}</div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; display: inline-block; flex-shrink: 0;"></span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: ${color};">${label}</span>
                        </div>
                        <div style="font-size: 0.75rem; color: #475569; margin-bottom: 10px;">${monthly}</div>
                        <a href="/city/${city.slug}" style="display: block; text-align: center; background: #4ECDC4; color: white; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none;">View details →</a>
                    </div>
                `, { maxWidth: 200 });

                marker.addTo(map);
            });
        };
        document.body.appendChild(script);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [cities]);

    return (
        <div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost of living:</span>
                {[
                    { color: '#22c55e', label: 'Very affordable' },
                    { color: '#4ECDC4', label: 'Affordable' },
                    { color: '#F7931E', label: 'Moderate' },
                    { color: '#ef4444', label: 'Expensive' },
                    { color: '#b91c1c', label: 'Very expensive' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{l.label}</span>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div
                ref={mapRef}
                className="world-map-container"
                style={{
                    width: '100%',
                    height: '440px',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f1f5f9',
                }}
            />
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'right' }}>
                Click any city for details · Scroll to zoom disabled · {cities.length} cities shown
            </p>
        </div>
    );
}

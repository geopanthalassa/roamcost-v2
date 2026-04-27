'use client';

import { useEffect, useRef } from 'react';

interface MapCity {
    city: string;
    country: string;
    slug: string;
    lat: number;
    long: number;
    cost_index: number;
    rent_index: number;
    population?: number;
}

interface WorldMapProps {
    cities: MapCity[];
}

function getCostColor(cost: number): string {
    if (cost <= 0) return '#94a3b8';
    if (cost < 200) return '#52B788';
    if (cost < 400) return '#40916C';
    if (cost < 600) return '#F7831E';
    if (cost < 800) return '#ef4444';
    return '#991b1b';
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

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load MarkerCluster CSS
        if (!document.querySelector('link[href*="markercluster"]')) {
            const link2 = document.createElement('link');
            link2.rel = 'stylesheet';
            link2.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
            document.head.appendChild(link2);

            const link3 = document.createElement('link');
            link3.rel = 'stylesheet';
            link3.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
            document.head.appendChild(link3);
        }

        const loadMap = () => {
            const L = (window as any).L;
            if (!mapRef.current || !L) return;

            const map = L.map(mapRef.current, {
                center: [25, 10],
                zoom: 2,
                zoomControl: true,
                scrollWheelZoom: true,
                minZoom: 2,
                maxZoom: 13,
            });

            mapInstance.current = map;

            // Clean light tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(map);

            // Create marker cluster group
            const clusterGroup = L.markerClusterGroup({
                maxClusterRadius: (zoom: number) => {
                    // At low zoom = big clusters, at high zoom = small clusters
                    if (zoom <= 3) return 80;
                    if (zoom <= 5) return 60;
                    if (zoom <= 7) return 40;
                    return 20;
                },
                iconCreateFunction: (cluster: any) => {
                    const count = cluster.getChildCount();
                    const size = count > 100 ? 44 : count > 20 ? 36 : 28;
                    return L.divIcon({
                        html: `<div style="
                            width: ${size}px; height: ${size}px;
                            background: rgba(15,23,42,0.85);
                            border: 2px solid #52B788;
                            border-radius: 50%;
                            display: flex; align-items: center; justify-content: center;
                            color: white; font-size: ${count > 99 ? '10' : '11'}px;
                            font-weight: 800; font-family: system-ui, sans-serif;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        ">${count}</div>`,
                        className: '',
                        iconSize: [size, size],
                        iconAnchor: [size/2, size/2],
                    });
                },
                animate: true,
                animateAddingMarkers: false,
                disableClusteringAtZoom: 10,
                spiderfyOnMaxZoom: true,
            });

            // Sort cities by population — biggest cities get bigger dots
            const sortedCities = [...cities].filter(c => c.lat && c.long);

            sortedCities.forEach(city => {
                const color = getCostColor(city.cost_index);
                const label = getCostLabel(city.cost_index);
                const pop = city.population || 0;
                
                // Radius based on population
                const radius = pop > 5000000 ? 9 : pop > 1000000 ? 7 : pop > 500000 ? 6 : 5;
                
                const monthly = city.rent_index > 0
                    ? `$${Math.round(city.rent_index * 10).toLocaleString()}/mo est.`
                    : 'Cost data unavailable';

                const marker = L.circleMarker([city.lat, city.long], {
                    radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 1.5,
                    opacity: 1,
                    fillOpacity: 0.9,
                });

                marker.bindPopup(`
                    <div style="font-family: system-ui, sans-serif; min-width: 165px;">
                        <div style="font-weight: 900; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;">${city.city}</div>
                        <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 8px;">${city.country}</div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            <span style="width: 9px; height: 9px; border-radius: 50%; background: ${color}; display: inline-block; flex-shrink: 0;"></span>
                            <span style="font-size: 0.73rem; font-weight: 700; color: ${color};">${label}</span>
                        </div>
                        <div style="font-size: 0.72rem; color: #475569; margin-bottom: 10px;">${monthly}</div>
                        <a href="/city/${city.slug}" style="display: block; text-align: center; background: #52B788; color: white; padding: 6px 12px; border-radius: 6px; font-size: 0.73rem; font-weight: 700; text-decoration: none;">View details →</a>
                    </div>
                `, { maxWidth: 200 });

                clusterGroup.addLayer(marker);
            });

            map.addLayer(clusterGroup);
        };

        // Load Leaflet script, then MarkerCluster
        const loadLeaflet = () => {
            if ((window as any).L) {
                // Load MarkerCluster after Leaflet
                const mc = document.createElement('script');
                mc.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
                mc.onload = loadMap;
                document.body.appendChild(mc);
            } else {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => {
                    const mc = document.createElement('script');
                    mc.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
                    mc.onload = loadMap;
                    document.body.appendChild(mc);
                };
                document.body.appendChild(script);
            }
        };

        loadLeaflet();

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
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost of living:</span>
                {[
                    { color: '#52B788', label: 'Very affordable' },
                    { color: '#40916C', label: 'Affordable' },
                    { color: '#F7831E', label: 'Moderate' },
                    { color: '#ef4444', label: 'Expensive' },
                    { color: '#991b1b', label: 'Very expensive' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{l.label}</span>
                    </div>
                ))}
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: 'auto' }}>
                    Scroll to zoom · Click clusters to expand · {cities.length} cities
                </span>
            </div>

            <div ref={mapRef} style={{ height: '500px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e2e8f0' }} />
        </div>
    );
}

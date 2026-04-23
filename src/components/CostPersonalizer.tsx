'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
    baseRent: number;
    baseFood: number;
    baseTransport: number;
    baseUtilities: number;
    city: string;
}

const TRANSPORT_OPTIONS = [
    { id: 'public', label: 'Public Transport', icon: 'BUS', multiplier: 1.0, desc: 'Bus, metro, train' },
    { id: 'uber', label: 'Uber / Taxi', icon: 'TAXI', multiplier: 3.5, desc: 'Daily rides' },
    { id: 'rental', label: 'Rent a Car', icon: 'CAR', multiplier: 5.0, desc: 'Monthly rental + fuel' },
    { id: 'own', label: 'Own Vehicle', icon: 'OWN', multiplier: 4.0, desc: 'Fuel + maintenance' },
    { id: 'bike', label: 'Bike / Walk', icon: 'BIKE', multiplier: 0.2, desc: 'Minimal cost' },
];

const FOOD_OPTIONS = [
    { id: 'market', label: 'Supermarket', icon: 'MARKET', multiplier: 0.7, desc: 'Cook at home mostly' },
    { id: 'mixed', label: 'Mixed', icon: 'MIXED', multiplier: 1.0, desc: 'Half home, half out' },
    { id: 'restaurants', label: 'Restaurants', icon: 'RESTAURANT', multiplier: 2.2, desc: 'Eat out daily' },
    { id: 'delivery', label: 'Food Delivery', icon: 'DELIVERY', multiplier: 2.8, desc: 'Apps like Uber Eats' },
];

const HOUSING_OPTIONS = [
    { id: 'hostel', label: 'Hostel / Shared', icon: 'HOSTEL', multiplier: 0.4, desc: 'Budget option' },
    { id: 'airbnb', label: 'Airbnb', icon: 'AIRBNB', multiplier: 1.6, desc: 'Short-term stays' },
    { id: 'rental', label: 'Long-term Rental', icon: 'APARTMENT', multiplier: 1.0, desc: 'Standard apartment' },
    { id: 'luxury', label: 'Luxury / Serviced', icon: 'HOTEL', multiplier: 2.5, desc: 'High-end apartment' },
];

const LIFESTYLE_OPTIONS = [
    { id: 'budget', label: 'Budget', icon: 'BUDGET', multiplier: 0.7, desc: 'Minimal spending' },
    { id: 'midrange', label: 'Mid-range', icon: 'MIDRANGE', multiplier: 1.0, desc: 'Comfortable living' },
    { id: 'luxury', label: 'Luxury', icon: 'LUXURY', multiplier: 2.0, desc: 'Premium everything' },
];


function getIcon(id: string): ReactNode {
    const icons: Record<string, ReactNode> = {
    BUS: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    TAXI: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2M9 17h6"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>,
    CAR: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1L2 12v4h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>,
    OWN: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
    BIKE: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 0 0-1-1h-1"/><path d="M5.5 17.5 10 7l5.5 8-4.5-4.5L15 6"/></svg>,
    MARKET: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    MIXED: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
    RESTAURANT: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
    DELIVERY: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    HOSTEL: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V12L12 3l9 9v10"/><path d="M9 22V12h6v10"/></svg>,
    AIRBNB: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    APARTMENT: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
    HOTEL: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
    BUDGET: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    MIDRANGE: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    LUXURY: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9 6 3"/><polyline points="22 9 12 22 2 9"/><line x1="6" y1="3" x2="12" y2="22"/><line x1="18" y1="3" x2="12" y2="22"/></svg>,
    };
    return icons[id] || null;
}

function OptionButton({ option, selected, onSelect, color }: {
    option: any; selected: boolean; onSelect: () => void; color: string;
}) {
    return (
        <button
            onClick={onSelect}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                padding: '0.75rem 0.5rem', borderRadius: '0.75rem', cursor: 'pointer',
                border: `2px solid ${selected ? color : '#e2e8f0'}`,
                backgroundColor: selected ? `${color}12` : '#ffffff',
                transition: 'all 0.15s', flex: 1, minWidth: '70px',
            }}
        >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getIcon(option.icon)}</span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: selected ? color : '#475569', textAlign: 'center', lineHeight: 1.2 }}>{option.label}</span>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.2 }}>{option.desc}</span>
        </button>
    );
}

export default function CostPersonalizer({ baseRent, baseFood, baseTransport, baseUtilities, city }: Props) {
    const [transport, setTransport] = useState('public');
    const [food, setFood] = useState('mixed');
    const [housing, setHousing] = useState('rental');
    const [lifestyle, setLifestyle] = useState('midrange');
    const [open, setOpen] = useState(false);

    const tOpt = TRANSPORT_OPTIONS.find(o => o.id === transport)!;
    const fOpt = FOOD_OPTIONS.find(o => o.id === food)!;
    const hOpt = HOUSING_OPTIONS.find(o => o.id === housing)!;
    const lOpt = LIFESTYLE_OPTIONS.find(o => o.id === lifestyle)!;

    const calcRent = Math.round(baseRent * hOpt.multiplier);
    const calcFood = Math.round(baseFood * fOpt.multiplier);
    const calcTransport = Math.round(baseTransport * tOpt.multiplier);
    const calcUtilities = Math.round(baseUtilities * lOpt.multiplier);
    const total = calcRent + calcFood + calcTransport + calcUtilities;
    const annual = total * 12;

    const GREEN = '#52B788';
    const ORANGE = '#F7831E';

    const barMax = Math.max(calcRent, calcFood * 3, calcTransport * 5, calcUtilities * 3, 100);

    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', overflow: 'hidden' }}>
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: open ? '1px solid #f1f5f9' : 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: '#F0FAF4', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                            <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                            <line x1="17" y1="16" x2="23" y2="16"/>
                        </svg>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Personalize your costs</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {open ? 'Adjust your lifestyle preferences' : `Estimated: $${total.toLocaleString()}/mo based on your style`}
                        </div>
                    </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {open && (
                <div style={{ padding: '1.5rem' }}>
                    {/* Transport */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>How do you get around?</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {TRANSPORT_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} selected={transport === o.id} onSelect={() => setTransport(o.id)} color={GREEN} />
                            ))}
                        </div>
                    </div>

                    {/* Food */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>How do you eat?</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {FOOD_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} selected={food === o.id} onSelect={() => setFood(o.id)} color={ORANGE} />
                            ))}
                        </div>
                    </div>

                    {/* Housing */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Where do you stay?</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {HOUSING_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} selected={housing === o.id} onSelect={() => setHousing(o.id)} color='#3b82f6' />
                            ))}
                        </div>
                    </div>

                    {/* Lifestyle */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Overall lifestyle</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {LIFESTYLE_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} selected={lifestyle === o.id} onSelect={() => setLifestyle(o.id)} color='#8b5cf6' />
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Your estimated monthly cost in {city}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: GREEN }}>${total.toLocaleString()}<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>/mo</span></div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Annual</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>${annual.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Breakdown bars */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Housing', value: calcRent, color: GREEN },
                                { label: 'Food', value: calcFood, color: ORANGE },
                                { label: 'Transport', value: calcTransport, color: '#3b82f6' },
                                { label: 'Utilities & extras', value: calcUtilities, color: '#8b5cf6' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>${item.value.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min((item.value / total) * 100, 100)}%`, backgroundColor: item.color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rent a car link */}
                        {(transport === 'rental') && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#eff6ff', borderRadius: '0.625rem', border: '1px solid #bfdbfe' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>Find rental cars in {city}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <a href={`https://www.rentalcars.com/en/country/search/?location=${encodeURIComponent(city)}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', backgroundColor: '#3b82f6', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                                        Rentalcars.com
                                    </a>
                                    <a href={`https://www.discovercars.com/search?location=${encodeURIComponent(city)}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', backgroundColor: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                                        DiscoverCars
                                    </a>
                                    <a href={`https://www.kayak.com/cars/${encodeURIComponent(city)}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', backgroundColor: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                                        Kayak Cars
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Airbnb link */}
                        {(housing === 'airbnb') && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#fff1f2', borderRadius: '0.625rem', border: '1px solid #fecdd3' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff385c', marginBottom: '0.5rem' }}>Find Airbnb stays in {city}</div>
                                <a href={`https://www.airbnb.com/s/${encodeURIComponent(city)}/homes`} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', backgroundColor: '#ff385c', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                                    Search on Airbnb
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

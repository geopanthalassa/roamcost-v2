'use client';

import { useState } from 'react';

interface Props {
    baseRent: number;
    baseFood: number;
    baseTransport: number;
    baseUtilities: number;
    city: string;
}

const TRANSPORT_OPTIONS = [
    { id: 'public', label: 'Public Transport', icon: '🚌', multiplier: 1.0, desc: 'Bus, metro, train' },
    { id: 'uber', label: 'Uber / Taxi', icon: '🚕', multiplier: 3.5, desc: 'Daily rides' },
    { id: 'rental', label: 'Rent a Car', icon: '🚗', multiplier: 5.0, desc: 'Monthly rental + fuel' },
    { id: 'own', label: 'Own Vehicle', icon: '🏎️', multiplier: 4.0, desc: 'Fuel + maintenance' },
    { id: 'bike', label: 'Bike / Walk', icon: '🚲', multiplier: 0.2, desc: 'Minimal cost' },
];

const FOOD_OPTIONS = [
    { id: 'market', label: 'Supermarket', icon: '🛒', multiplier: 0.7, desc: 'Cook at home mostly' },
    { id: 'mixed', label: 'Mixed', icon: '🍱', multiplier: 1.0, desc: 'Half home, half out' },
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️', multiplier: 2.2, desc: 'Eat out daily' },
    { id: 'delivery', label: 'Food Delivery', icon: '📱', multiplier: 2.8, desc: 'Apps like Uber Eats' },
];

const HOUSING_OPTIONS = [
    { id: 'hostel', label: 'Hostel / Shared', icon: '🛏️', multiplier: 0.4, desc: 'Budget option' },
    { id: 'airbnb', label: 'Airbnb', icon: '🏠', multiplier: 1.6, desc: 'Short-term stays' },
    { id: 'rental', label: 'Long-term Rental', icon: '🏢', multiplier: 1.0, desc: 'Standard apartment' },
    { id: 'luxury', label: 'Luxury / Serviced', icon: '🏨', multiplier: 2.5, desc: 'High-end apartment' },
];

const LIFESTYLE_OPTIONS = [
    { id: 'budget', label: 'Budget', icon: '💰', multiplier: 0.7, desc: 'Minimal spending' },
    { id: 'midrange', label: 'Mid-range', icon: '🌟', multiplier: 1.0, desc: 'Comfortable living' },
    { id: 'luxury', label: 'Luxury', icon: '💎', multiplier: 2.0, desc: 'Premium everything' },
];

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
            <span style={{ fontSize: '1.4rem' }}>{option.icon}</span>
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

    const GREEN = '#4ECDC4';
    const ORANGE = '#F7931E';

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
                    <div style={{ width: '36px', height: '36px', backgroundColor: '#f0fdfc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

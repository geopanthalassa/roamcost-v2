'use client';

import { useState } from 'react';

interface Props {
    baseRent: number;
    baseFood: number;
    baseTransport: number;
    baseUtilities: number;
    city: string;
}

// Multipliers calibrated against Numbeo data
// RoamCost food_index is daily cost × 30 but underestimates eating out
// RoamCost transport_index is monthly pass cost only — excludes extras

const TRANSPORT_OPTIONS = [
    { id: 'public',  label: 'Public Transport', multiplier: 2.0,  desc: 'Bus, metro, monthly pass' },
    { id: 'uber',    label: 'Uber / Taxi',       multiplier: 6.0,  desc: 'Daily rideshare' },
    { id: 'rental',  label: 'Rent a Car',        multiplier: 9.0,  desc: 'Monthly rental + fuel + parking' },
    { id: 'own',     label: 'Own Vehicle',       multiplier: 7.0,  desc: 'Fuel + insurance + maintenance' },
    { id: 'bike',    label: 'Bike / Walk',       multiplier: 0.5,  desc: 'Minimal cost' },
];

const FOOD_OPTIONS = [
    { id: 'market',      label: 'Cook at Home',     multiplier: 1.8,  desc: 'Groceries, mostly home cooking' },
    { id: 'mixed',       label: 'Mixed',            multiplier: 3.0,  desc: 'Half home, half eating out' },
    { id: 'restaurants', label: 'Eat Out Daily',    multiplier: 5.0,  desc: 'Restaurants every day' },
    { id: 'delivery',    label: 'Food Delivery',    multiplier: 6.5,  desc: 'Apps like Uber Eats / Rappi' },
];

const HOUSING_OPTIONS = [
    { id: 'hostel',  label: 'Hostel / Shared', multiplier: 0.4,  desc: 'Shared room or hostel' },
    { id: 'airbnb',  label: 'Airbnb',          multiplier: 2.2,  desc: 'Short-term furnished rental' },
    { id: 'rental',  label: 'Long-term Rental',multiplier: 1.0,  desc: 'Standard 1BR apartment' },
    { id: 'luxury',  label: 'Luxury',          multiplier: 2.8,  desc: 'High-end serviced apartment' },
];

const LIFESTYLE_OPTIONS = [
    { id: 'budget',   label: 'Budget',    multiplier: 0.6, desc: 'Minimal extras' },
    { id: 'midrange', label: 'Mid-range', multiplier: 1.0, desc: 'Comfortable, some extras' },
    { id: 'luxury',   label: 'Luxury',    multiplier: 2.2, desc: 'Gyms, travel, dining, nightlife' },
];

// SVG icons as path strings — no emojis
const ICONS: Record<string, string> = {
    public:      'M8 17h8M3 6h18v11H3zM7 6V4h10v2',
    uber:        'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M13 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0',
    rental:      'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    own:         'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 6v4l3 3',
    bike:        'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M3 12a6 6 0 1 0 12 0M12 12a6 6 0 1 0 12 0',
    market:      'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
    mixed:       'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z',
    restaurants: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
    delivery:    'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
    hostel:      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m6-6v-4',
    airbnb:      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    longterm:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    luxury:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    budget:      'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    midrange:    'M22 12h-4l-3 9L9 3l-3 9H2',
    luxurylife:  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
};

function Icon({ id, color, size = 16 }: { id: string; color: string; size?: number }) {
    const d = ICONS[id] || ICONS.midrange;
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={d}/>
        </svg>
    );
}

function OptionButton({ option, iconId, selected, onSelect, color }: {
    option: { id: string; label: string; desc: string };
    iconId: string;
    selected: boolean;
    onSelect: () => void;
    color: string;
}) {
    return (
        <button onClick={onSelect} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
            padding: '0.75rem 0.5rem', borderRadius: '0.75rem', cursor: 'pointer',
            border: `2px solid ${selected ? color : '#e2e8f0'}`,
            backgroundColor: selected ? `${color}14` : '#ffffff',
            transition: 'all 0.15s', flex: 1, minWidth: '70px', outline: 'none',
        }}>
            <Icon id={iconId} color={selected ? color : '#94a3b8'} size={18} />
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

    const calcRent      = Math.round(baseRent * hOpt.multiplier);
    const calcFood      = Math.round(baseFood * fOpt.multiplier);
    const calcTransport = Math.round(baseTransport * tOpt.multiplier);
    const calcUtilities = Math.round(baseUtilities * lOpt.multiplier);
    const total  = calcRent + calcFood + calcTransport + calcUtilities;

    const GREEN  = '#52B788';
    const ORANGE = '#F7831E';

    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: open ? '1px solid #f1f5f9' : 'none',
            }}>
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
                            {open ? 'Adjust to match your lifestyle' : `~$${total.toLocaleString()}/mo based on your selections`}
                        </div>
                    </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {open && (
                <div style={{ padding: '1.5rem' }}>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Transport</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {TRANSPORT_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} iconId={o.id} selected={transport === o.id} onSelect={() => setTransport(o.id)} color={GREEN} />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Food</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {FOOD_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} iconId={o.id} selected={food === o.id} onSelect={() => setFood(o.id)} color={ORANGE} />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Housing</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {HOUSING_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} iconId={o.id === 'rental' ? 'longterm' : o.id} selected={housing === o.id} onSelect={() => setHousing(o.id)} color='#3b82f6' />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>Lifestyle</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {LIFESTYLE_OPTIONS.map(o => (
                                <OptionButton key={o.id} option={o} iconId={o.id === 'budget' ? 'budget' : o.id === 'midrange' ? 'midrange' : 'luxurylife'} selected={lifestyle === o.id} onSelect={() => setLifestyle(o.id)} color='#8b5cf6' />
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Your estimated cost in {city}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: GREEN }}>
                                    ${total.toLocaleString()}<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>/mo</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Per year</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>${(total * 12).toLocaleString()}</div>
                            </div>
                        </div>

                        {[
                            { label: 'Housing',   value: calcRent,      color: GREEN },
                            { label: 'Food',       value: calcFood,      color: ORANGE },
                            { label: 'Transport',  value: calcTransport, color: '#3b82f6' },
                            { label: 'Utilities',  value: calcUtilities, color: '#8b5cf6' },
                        ].map(item => (
                            <div key={item.label} style={{ marginBottom: '0.625rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{item.label}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>${item.value.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min((item.value / (total || 1)) * 100, 100)}%`, backgroundColor: item.color, borderRadius: '3px', transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        ))}

                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '0.75rem 0 0', lineHeight: 1.4 }}>
                            Estimates calibrated against Numbeo data. Actual costs vary by neighborhood, habits and season.
                        </p>

                        {transport === 'rental' && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.625rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>Find rental cars in {city}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <a href={`https://www.rentalcars.com/en/country/search/?location=${encodeURIComponent(city)}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', backgroundColor: '#3b82f6', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                                        Rentalcars.com
                                    </a>
                                    <a href={`https://www.discovercars.com/search?location=${encodeURIComponent(city)}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', backgroundColor: '#fff', padding: '0.3rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                                        DiscoverCars
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

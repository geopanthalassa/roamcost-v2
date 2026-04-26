'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const GREEN = '#52B788';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Known slugs map for fast resolution
const CITY_SLUGS: Record<string, string> = {
    'Bangkok': 'bangkok', 'Bali': 'bali', 'Lisbon': 'lisbon', 'Barcelona': 'barcelona',
    'Berlin': 'berlin', 'Prague': 'prague', 'Tokyo': 'tokyo', 'Seoul': 'seoul',
    'Dubai': 'dubai', 'Singapore': 'singapore', 'New York': 'new-york',
    'Mexico City': 'mexico-city', 'Buenos Aires': 'buenos-aires', 'Lima': 'lima',
    'Medellín': 'medellin', 'Amsterdam': 'amsterdam', 'Vienna': 'vienna',
    'Madrid': 'madrid', 'Sydney': 'sydney', 'Melbourne': 'melbourne',
    'Toronto': 'toronto', 'Vancouver': 'vancouver', 'Miami': 'miami',
    'Los Angeles': 'los-angeles', 'Paris': 'paris', 'Rome': 'rome',
    'Istanbul': 'istanbul', 'Tbilisi': 'tbilisi', 'Chiang Mai': 'chiang-mai',
    'Ho Chi Minh City': 'ho-chi-minh-city', 'Hanoi': 'hanoi', 'London': 'london',
    'Zurich': 'zurich', 'Geneva': 'geneva', 'Brussels': 'brussels', 'Munich': 'munich',
    'Hamburg': 'hamburg', 'Milan': 'milan', 'Florence': 'florence', 'Budapest': 'budapest',
    'Warsaw': 'warsaw', 'Stockholm': 'stockholm', 'Oslo': 'oslo', 'Copenhagen': 'copenhagen',
    'Athens': 'athens', 'Dublin': 'dublin', 'Bucharest': 'bucharest', 'Taipei': 'taipei',
    'Manila': 'manila', 'Jakarta': 'jakarta', 'Osaka': 'osaka', 'Beijing': 'beijing',
    'Shanghai': 'shanghai', 'Kuala Lumpur': 'kuala-lumpur', 'Abu Dhabi': 'abu-dhabi',
    'Tel Aviv': 'tel-aviv', 'Riyadh': 'riyadh', 'Doha': 'doha', 'Cairo': 'cairo',
    'Nairobi': 'nairobi', 'Cape Town': 'cape-town', 'Casablanca': 'casablanca',
    'Chicago': 'chicago', 'San Francisco': 'san-francisco', 'Boston': 'boston',
    'Seattle': 'seattle', 'Denver': 'denver', 'Atlanta': 'atlanta', 'Dallas': 'dallas',
    'Houston': 'houston', 'Montreal': 'montreal', 'Bogotá': 'bogota',
    'São Paulo': 'sao-paulo', 'Rio de Janeiro': 'rio-de-janeiro', 'Santiago': 'santiago',
    'Montevideo': 'montevideo', 'Delhi': 'delhi', 'Mumbai': 'mumbai',
    'Bangalore': 'bangalore', 'Kyiv': 'kyiv', 'Moscow': 'moscow', 'Sofia': 'sofia',
    'Belgrade': 'belgrade', 'Edinburgh': 'edinburgh', 'Porto': 'porto',
    'Seville': 'seville', 'Valencia': 'valencia', 'Kraków': 'krakow',
    'Tallinn': 'tallinn', 'Riga': 'riga', 'Vilnius': 'vilnius', 'Auckland': 'auckland',
    'Amman': 'amman', 'Panama City': 'panama-city',
    'Medellin': 'medellin', 'Quito': 'quito',
};

const POPULAR_COMPARISONS = [
    ['bangkok', 'bali'], ['new-york', 'mexico-city'], ['lisbon', 'barcelona'],
    ['berlin', 'prague'], ['dubai', 'singapore'], ['tokyo', 'seoul'],
    ['buenos-aires', 'lima'], ['amsterdam', 'prague'], ['sydney', 'melbourne'],
    ['miami', 'mexico-city'], ['london', 'berlin'], ['chiang-mai', 'medellin'],
    ['lisbon', 'tbilisi'], ['paris', 'madrid'],
];

interface Suggestion { city: string; country: string; slug: string; }

export default function ComparePage() {
    const router = useRouter();
    const [slots, setSlots] = useState(['', '']);
    const [focusIdx, setFocusIdx] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchCities = async (q: string) => {
        if (!q || q.length < 1) {
            setSuggestions(Object.entries(CITY_SLUGS).slice(0, 8).map(([city, slug]) => ({
                city, slug, country: ''
            })));
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/cities?search=${encodeURIComponent(q)}`);
            if (res.ok) setSuggestions(await res.json());
        } catch {}
        setLoading(false);
    };

    const handleInput = (i: number, val: string) => {
        const ns = [...slots]; ns[i] = val; setSlots(ns);
        clearTimeout(debounceRef.current ?? undefined);
        debounceRef.current = setTimeout(() => searchCities(val), 200);
    };

    const pickCity = (i: number, suggestion: Suggestion) => {
        const ns = [...slots]; ns[i] = suggestion.city; setSlots(ns);
        setSuggestions([]);
        setFocusIdx(null);
    };

    const getSlug = (name: string) => {
        if (CITY_SLUGS[name]) return CITY_SLUGS[name];
        const found = Object.keys(CITY_SLUGS).find(k => k.toLowerCase() === name.toLowerCase());
        if (found) return CITY_SLUGS[found];
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleCompare = () => {
        const valid = slots.filter(s => s.trim());
        if (valid.length < 2) return;
        router.push(`/compare/${valid.map(getSlug).join('-vs-')}`);
    };

    const addSlot = () => { if (slots.length < 4) setSlots([...slots, '']); };
    const removeSlot = (i: number) => { if (slots.length > 2) setSlots(slots.filter((_, idx) => idx !== i)); };

    const validCount = slots.filter(s => s.trim()).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '4rem 0 3rem' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 0.75rem', letterSpacing: '-0.04em' }}>Compare Cities</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', margin: 0 }}>
                        Add up to 4 cities. See costs, safety and quality of life side by side.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* Input box */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {slots.map((slot, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', position: 'relative' }}>
                                    {/* Number */}
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: slot ? GREEN : '#f1f5f9', color: slot ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0, transition: 'all 0.2s' }}>
                                        {i + 1}
                                    </div>

                                    {/* Input */}
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder={i === 0 ? 'First city — e.g. Bangkok' : i === 1 ? 'Second city — e.g. Lisbon' : `City ${i + 1}`}
                                            value={slot}
                                            onChange={e => handleInput(i, e.target.value)}
                                            onFocus={() => { setFocusIdx(i); searchCities(slot); }}
                                            onBlur={() => setTimeout(() => { setFocusIdx(null); setSuggestions([]); }, 200)}
                                            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: `2px solid ${slot ? GREEN : focusIdx === i ? '#94a3b8' : '#e2e8f0'}`, fontSize: '0.95rem', fontWeight: 600, outline: 'none', color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                                        />
                                        {/* Dropdown */}
                                        {focusIdx === i && suggestions.length > 0 && (
                                            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 500, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                                                {loading && (
                                                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Searching...</div>
                                                )}
                                                {suggestions.map((s, si) => (
                                                    <button key={si} onMouseDown={() => pickCity(i, s)}
                                                        style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: si < suggestions.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                        <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{s.city}</span>
                                                        {s.country && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.country}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove */}
                                    {slots.length > 2 && (
                                        <button onClick={() => removeSlot(i)} style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    )}
                                </div>

                                {/* VS divider */}
                                {i < slots.length - 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', marginLeft: '42px' }}>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#cbd5e1', letterSpacing: '0.1em' }}>VS</span>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add city */}
                        {slots.length < 4 && (
                            <div style={{ marginTop: '0.5rem', marginLeft: '42px' }}>
                                <button onClick={addSlot}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '2rem', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', cursor: 'pointer', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s' }}>
                                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, fontSize: '1rem', fontWeight: 900 }}>+</span>
                                    Add city
                                    <span style={{ color: '#d1d5db', fontSize: '0.72rem' }}>({4 - slots.length} left)</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Compare button */}
                    <button onClick={handleCompare} disabled={validCount < 2}
                        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '0.875rem', backgroundColor: validCount >= 2 ? GREEN : '#e2e8f0', color: validCount >= 2 ? 'white' : '#94a3b8', fontSize: '1rem', fontWeight: 800, border: 'none', cursor: validCount >= 2 ? 'pointer' : 'default', transition: 'all 0.2s', letterSpacing: '-0.01em' }}>
                        {validCount >= 2 ? `Compare ${validCount} ${validCount === 1 ? 'city' : 'cities'} →` : 'Select at least 2 cities'}
                    </button>
                </div>

                {/* Popular */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular comparisons</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {POPULAR_COMPARISONS.map(([a, b]) => (
                            <a key={`${a}-${b}`} href={`/compare/${a}-vs-${b}`}
                                style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 0.875rem', borderRadius: '2rem', backgroundColor: '#f8fafc', color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                                {a.replace(/-/g, ' ')} vs {b.replace(/-/g, ' ')}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

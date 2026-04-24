'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const GREEN = '#52B788';
const ORANGE = '#F7831E';

const POPULAR = [
    'Bangkok', 'Bali', 'Lisbon', 'Barcelona', 'Berlin', 'Prague',
    'Tokyo', 'Seoul', 'Dubai', 'Singapore', 'New York', 'Mexico City',
    'Buenos Aires', 'Lima', 'Medellín', 'Amsterdam', 'Vienna', 'Madrid',
    'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Miami', 'Los Angeles',
    'Paris', 'Rome', 'Istanbul', 'Tbilisi', 'Chiang Mai', 'Ho Chi Minh City',
];

export default function ComparePage() {
    const router = useRouter();
    const [cities, setCities] = useState<string[]>(['', '']);
    const [inputs, setInputs] = useState<string[]>(['', '']);
    const [focusIdx, setFocusIdx] = useState<number | null>(null);

    const slugify = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleCompare = useCallback(() => {
        const valid = cities.filter(c => c.trim());
        if (valid.length < 2) return;
        const slugs = valid.map(slugify).join('-vs-');
        router.push(`/compare/${slugs}`);
    }, [cities, router]);

    const addCity = () => {
        if (cities.length < 4) {
            setCities([...cities, '']);
            setInputs([...inputs, '']);
        }
    };

    const removeCity = (i: number) => {
        if (cities.length <= 2) return;
        setCities(cities.filter((_, idx) => idx !== i));
        setInputs(inputs.filter((_, idx) => idx !== i));
    };

    const setCity = (i: number, val: string) => {
        const nc = [...cities]; nc[i] = val; setCities(nc);
        const ni = [...inputs]; ni[i] = val; setInputs(ni);
    };

    const suggestions = (i: number) =>
        inputs[i].length > 0
            ? POPULAR.filter(c => c.toLowerCase().startsWith(inputs[i].toLowerCase())).slice(0, 5)
            : POPULAR.slice(0, 8);

    const validCount = cities.filter(c => c.trim()).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '4rem 0 3rem' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 0.75rem', letterSpacing: '-0.04em' }}>
                        Compare Cities
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', margin: 0 }}>
                        Add up to 4 cities. See costs, safety, internet and quality of life side by side.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* City inputs */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {cities.map((city, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                                    {/* Number badge */}
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: city ? GREEN : '#e2e8f0', color: city ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0, transition: 'all 0.2s' }}>
                                        {i + 1}
                                    </div>
                                    {/* Input */}
                                    <input
                                        type="text"
                                        placeholder={i === 0 ? 'First city (e.g. Bangkok)' : i === 1 ? 'Second city (e.g. Lisbon)' : `City ${i + 1}`}
                                        value={inputs[i]}
                                        onChange={e => setCity(i, e.target.value)}
                                        onFocus={() => setFocusIdx(i)}
                                        onBlur={() => setTimeout(() => setFocusIdx(null), 150)}
                                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.625rem', border: `2px solid ${city ? GREEN : focusIdx === i ? '#cbd5e1' : '#e2e8f0'}`, fontSize: '0.95rem', fontWeight: 600, outline: 'none', transition: 'border-color 0.15s', color: '#0f172a' }}
                                    />
                                    {/* Remove button (only if > 2 cities) */}
                                    {cities.length > 2 && (
                                        <button onClick={() => removeCity(i)}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#94a3b8', fontWeight: 900, fontSize: '1rem' }}>
                                            ×
                                        </button>
                                    )}
                                </div>

                                {/* Suggestions dropdown */}
                                {focusIdx === i && (
                                    <div style={{ position: 'absolute', top: '100%', left: '36px', right: cities.length > 2 ? '36px' : '0', zIndex: 100, backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.625rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginTop: '4px', overflow: 'hidden' }}>
                                        {suggestions(i).map(s => (
                                            <button key={s} onMouseDown={() => { setCity(i, s); setFocusIdx(null); }}
                                                style={{ width: '100%', padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* VS divider */}
                                {i < cities.length - 1 && (
                                    <div style={{ textAlign: 'center', padding: '0.2rem 0 0', marginLeft: '36px' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.1em' }}>VS</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add city button */}
                        {cities.length < 4 && (
                            <button onClick={addCity}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: '0.625rem', border: `2px dashed #e2e8f0`, backgroundColor: 'transparent', cursor: 'pointer', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.15s', marginLeft: '36px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: GREEN, fontWeight: 900 }}>+</div>
                                Add another city
                                <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>({4 - cities.length} more)</span>
                            </button>
                        )}
                    </div>

                    {/* Compare button */}
                    <button onClick={handleCompare} disabled={validCount < 2}
                        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '0.875rem', backgroundColor: validCount >= 2 ? GREEN : '#e2e8f0', color: validCount >= 2 ? 'white' : '#94a3b8', fontSize: '1rem', fontWeight: 800, border: 'none', cursor: validCount >= 2 ? 'pointer' : 'default', transition: 'all 0.15s', letterSpacing: '-0.01em' }}>
                        {validCount >= 2 ? `Compare ${validCount} cities →` : 'Add at least 2 cities'}
                    </button>
                </div>

                {/* Popular comparisons */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular comparisons</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[
                            ['bangkok', 'bali'],
                            ['new-york', 'mexico-city'],
                            ['lisbon', 'barcelona'],
                            ['berlin', 'prague'],
                            ['dubai', 'singapore'],
                            ['tokyo', 'seoul'],
                            ['buenos-aires', 'lima'],
                            ['amsterdam', 'prague'],
                            ['sydney', 'melbourne'],
                            ['miami', 'mexico-city'],
                            ['london', 'berlin'],
                            ['paris', 'madrid'],
                        ].map(([a, b]) => (
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

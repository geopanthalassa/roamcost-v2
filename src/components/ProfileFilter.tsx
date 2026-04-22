'use client';

import { useState } from 'react';
import Link from 'next/link';

const PROFILES = [
    {
        id: 'nomad',
        label: 'Digital Nomad',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
        desc: 'Remote work, fast internet, coworking',
        rankings: [
            { href: '/rankings/nomads', label: 'Best for Nomads' },
            { href: '/rankings/cheapest', label: 'Most Affordable' },
            { href: '/compare/bali-vs-chiang-mai', label: 'Bali vs Chiang Mai' },
            { href: '/compare/lisbon-vs-barcelona', label: 'Lisbon vs Barcelona' },
            { href: '/city/bangkok', label: 'Bangkok' },
            { href: '/city/lisbon', label: 'Lisbon' },
        ],
        color: '#5b8c71',
        bg: '#f0fdf4',
        border: '#bbf7d0',
    },
    {
        id: 'expat',
        label: 'Expat / Relocation',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        desc: 'Long-term living, schools, healthcare',
        rankings: [
            { href: '/rankings/quality', label: 'Quality of Life' },
            { href: '/rankings/safest', label: 'Safest Cities' },
            { href: '/compare/dubai-vs-singapore', label: 'Dubai vs Singapore' },
            { href: '/compare/berlin-vs-amsterdam', label: 'Berlin vs Amsterdam' },
            { href: '/city/singapore', label: 'Singapore' },
            { href: '/city/dubai', label: 'Dubai' },
        ],
        color: '#3b82f6',
        bg: '#eff6ff',
        border: '#bfdbfe',
    },
    {
        id: 'travel',
        label: 'Vacation / Travel',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.41 16z"/></svg>,
        desc: 'Budget travel, experiences, short stays',
        rankings: [
            { href: '/rankings/cheapest', label: 'Cheapest Cities' },
            { href: '/compare/bangkok-vs-bali', label: 'Bangkok vs Bali' },
            { href: '/compare/paris-vs-barcelona', label: 'Paris vs Barcelona' },
            { href: '/compare/tokyo-vs-seoul', label: 'Tokyo vs Seoul' },
            { href: '/city/bangkok', label: 'Bangkok' },
            { href: '/city/tokyo', label: 'Tokyo' },
        ],
        color: '#e8833a',
        bg: '#fff8f0',
        border: '#fed7aa',
    },
    {
        id: 'all',
        label: 'Explore All',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
        desc: 'Browse all cities and rankings',
        rankings: [
            { href: '/rankings/quality', label: 'Quality of Life' },
            { href: '/rankings/cheapest', label: 'Most Affordable' },
            { href: '/rankings/safest', label: 'Safest Cities' },
            { href: '/rankings/nomads', label: 'Best for Nomads' },
            { href: '/compare', label: 'Compare Cities' },
            { href: '/calculator', label: 'Currency Converter' },
        ],
        color: '#8b5cf6',
        bg: '#f5f3ff',
        border: '#ddd6fe',
    },
];

export default function ProfileFilter() {
    const [active, setActive] = useState('nomad');
    const profile = PROFILES.find(p => p.id === active)!;

    return (
        <section style={{ padding: '4rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5b8c71', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Personalized for you</p>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
                        What describes you best?
                    </h2>
                </div>

                {/* Profile selector */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {PROFILES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActive(p.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.625rem 1.25rem', borderRadius: '2rem',
                                border: `2px solid ${active === p.id ? p.color : '#e2e8f0'}`,
                                backgroundColor: active === p.id ? p.bg : '#ffffff',
                                color: active === p.id ? p.color : '#64748b',
                                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span style={{ color: active === p.id ? p.color : '#94a3b8' }}>{p.icon}</span>
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div style={{
                    backgroundColor: profile.bg,
                    border: `1px solid ${profile.border}`,
                    borderRadius: '1.25rem',
                    padding: '1.75rem',
                    transition: 'all 0.2s',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ color: profile.color }}>{profile.icon}</div>
                        <div>
                            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>{profile.label}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{profile.desc}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                        {profile.rankings.map(r => (
                            <Link
                                key={r.href}
                                href={r.href}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.75rem 1rem', backgroundColor: '#ffffff',
                                    borderRadius: '0.75rem', border: '1px solid #e2e8f0',
                                    textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a',
                                    gap: '0.5rem',
                                }}
                            >
                                <span>{r.label}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={profile.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .profile-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </section>
    );
}

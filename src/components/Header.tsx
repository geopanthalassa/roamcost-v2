'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/rankings/quality', label: 'Rankings', match: '/rankings' },
    { href: '/compare', label: 'Compare', match: '/compare' },
    { href: '/hot-takes', label: 'Hot Takes', match: '/hot-takes' },
    { href: '/blog', label: 'Blog', match: '/blog' },
    { href: '/about', label: 'About', match: '/about' },
    { href: '/calculator', label: 'Converter', match: '/calculator' },
];

const CURRENCIES = ['USD','EUR','GBP','JPY','ARS','BRL','MXN','COP','CLP','CAD','AUD','CHF','CNY','INR','SGD','HKD','KRW','TRY','ZAR','AED'];

export default function Header() {
    const { currency, setCurrency } = useCurrency();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (link: typeof NAV_LINKS[0]) => {
        if (link.href === '/') return pathname === '/';
        const match = link.match || link.href;
        return pathname.startsWith(match);
    };

    return (
        <header style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <Image src="/roamcost-logo.png" alt="RoamCost" width={140} height={38} style={{ objectFit: 'contain' }} priority />
                </Link>

                {/* Desktop nav */}
                <nav className="header-nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {NAV_LINKS.map(l => {
                        const active = isActive(l);
                        const isHot = l.href === '/hot-takes';
                        const linkColor = isHot ? '#F7831E' : active ? '#52B788' : '#64748b';
                        const borderColor = isHot && active ? '#F7831E' : active ? '#52B788' : 'transparent';
                        return (
                            <Link key={l.href} href={l.href} style={{
                                fontWeight: active || isHot ? 800 : 600,
                                color: linkColor,
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                borderBottom: `2px solid ${borderColor}`,
                                paddingBottom: '2px',
                                transition: 'color 0.15s',
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                            }}>
                                {l.label}
                                {isHot && <span style={{ fontSize: '0.5rem', backgroundColor: '#F7831E', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '2rem', fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.4 }}>NEW</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select value={currency} onChange={e => setCurrency(e.target.value as any)}
                        style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <button onClick={() => setMenuOpen(!menuOpen)} className="header-hamburger"
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                            {menuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.5rem 1.5rem 1rem', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    {NAV_LINKS.map(l => {
                        const active = isActive(l);
                        const isHot = l.href === '/hot-takes';
                        return (
                            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', fontWeight: 700, color: isHot ? '#F7831E' : active ? '#52B788' : '#0f172a', fontSize: '0.95rem', borderBottom: '1px solid #f8fafc', textDecoration: 'none' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {l.label}
                                    {isHot && <span style={{ fontSize: '0.5rem', backgroundColor: '#F7831E', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '2rem', fontWeight: 900 }}>NEW</span>}
                                </span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M9 18l6-6-6-6"/></svg>
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
}


import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Travel & Cost of Living Blog 2026 | RoamCost',
    description: 'Expert guides on cost of living, digital nomad destinations, cheapest cities and how to move abroad on a budget. Updated monthly with real data.',
    keywords: 'cost of living guide, digital nomad cities, cheapest countries to live, move abroad guide, expat tips',
    alternates: { canonical: 'https://www.roamcost.com/blog' },
};

const POSTS = [

    { slug: 'world-cup-2026-currency-guide', title: 'World Cup 2026 Currency Guide', desc: 'How to exchange USD, MXN and CAD for World Cup 2026. Best rates and money-saving tips for every host country.', category: 'World Cup 2026', date: 'June 2026', readTime: '10 min' },
    { slug: 'world-cup-2026-travel-guide', title: 'FIFA World Cup 2026 Travel Guide', desc: 'Complete travel cost guide for all 16 host cities in USA, Mexico and Canada. Cheapest cities and budget tips.', category: 'World Cup 2026', date: 'June 2026', readTime: '12 min' },
    { slug: 'cheapest-world-cup-2026-cities', title: 'Cheapest World Cup 2026 Host Cities', desc: 'Which FIFA World Cup 2026 host city is cheapest? Complete cost comparison of all 16 cities.', category: 'World Cup 2026', date: 'June 2026', readTime: '10 min' },
    { slug: 'world-cup-2026-mexico-city-guide', title: 'World Cup 2026 Mexico City Guide', desc: 'Everything you need for the FIFA World Cup 2026 in Mexico City — costs, neighborhoods and budget tips.', category: 'World Cup 2026', date: 'June 2026', readTime: '10 min' },
    { slug: 'cost-of-living-berlin-2026', title: 'Cost of Living in Berlin 2026', desc: 'Complete expat guide to Berlin — real rent, food, transport and lifestyle costs for 2026.', category: 'Europe', date: 'June 2026', readTime: '10 min' },
    { slug: 'cost-of-living-new-york-2026', title: 'Cost of Living in New York 2026', desc: 'The real numbers for living in NYC in 2026. Honest rent, food and lifestyle costs for newcomers.', category: 'North America', date: 'June 2026', readTime: '10 min' },
    { slug: 'cost-of-living-lisbon-2026', title: 'Cost of Living in Lisbon 2026', desc: 'Complete expat guide to Lisbon — real rent prices, food costs and the D8 digital nomad visa.', category: 'Europe', date: 'June 2026', readTime: '10 min' },
    { slug: 'cost-of-living-medellin-2026', title: 'Cost of Living in Medellin 2026', desc: 'How much does it cost to live in Medellin? Complete breakdown for expats and digital nomads.', category: 'Latin America', date: 'June 2026', readTime: '10 min' },
    { slug: 'cost-of-living-tbilisi-2026', title: 'Cost of Living in Tbilisi 2026', desc: 'The budget nomad capital — visa-free 365 days, $700/month living and incredible food.', category: 'Europe', date: 'June 2026', readTime: '9 min' },
    { slug: 'internet-speed-cities-digital-nomads-2026', title: 'Best Cities for Internet Speed 2026', desc: 'The cities with the fastest internet for remote workers and how much they cost to live in.', category: 'Nomads', date: 'May 2026', readTime: '8 min' },
    { slug: 'best-cities-remote-workers-latin-america-2026', title: 'Best Cities for Remote Workers in Latin America', desc: 'Top Latin American cities for digital nomads — fast internet, affordable rent and great communities.', category: 'Latin America', date: 'May 2026', readTime: '9 min' },
    { slug: 'cheapest-cities-eastern-europe-digital-nomads-2026', title: 'Cheapest Eastern Europe Cities for Nomads', desc: 'Tbilisi, Bucharest, Belgrade — the most affordable Eastern European cities with fast internet.', category: 'Europe', date: 'May 2026', readTime: '9 min' },
    { slug: 'cost-of-living-buenos-aires-2026', title: 'Cost of Living in Buenos Aires 2026', desc: 'Complete expat guide to Buenos Aires — rent, food, the dollar advantage and neighborhood guide.', category: 'Latin America', date: 'May 2026', readTime: '10 min' },
    { slug: 'cost-of-living-bangkok-2026', title: 'Cost of Living in Bangkok 2026', desc: 'How much does it really cost to live in Bangkok? Real costs for expats and digital nomads.', category: 'Asia', date: 'May 2026', readTime: '10 min' },
    { slug: 'cheapest-cities-europe-2026', title: 'Cheapest Cities to Live in Europe in 2026', desc: 'From Lisbon to Tbilisi — the most affordable European cities with full cost breakdowns for rent, food and transport.', category: 'Europe', date: 'April 2026', readTime: '8 min' },
    { slug: 'best-cities-digital-nomads-2026', title: 'Best Cities for Digital Nomads in 2026', desc: 'Fast internet, coworking spaces, visa options and affordability. The definitive nomad city guide for 2026.', category: 'Nomads', date: 'April 2026', readTime: '10 min' },
    { slug: 'cost-of-living-southeast-asia', title: 'Cost of Living in Southeast Asia: Complete Guide', desc: 'Bangkok, Bali, Hanoi, Chiang Mai — how much does it really cost to live in Southeast Asia in 2026?', category: 'Asia', date: 'March 2026', readTime: '9 min' },
    { slug: 'move-to-lisbon-2026', title: 'Moving to Lisbon in 2026: Complete Cost Guide', desc: 'Rent, food, transport, taxes and visas. Everything you need to know before moving to Lisbon.', category: 'Europe', date: 'March 2026', readTime: '7 min' },
    { slug: 'live-on-2000-month', title: 'Best Cities to Live Comfortably on $2,000/Month', desc: 'Which cities give you a great lifestyle for $2,000/month? We crunched the data across 45,000 cities.', category: 'Budget', date: 'March 2026', readTime: '6 min' },
    { slug: 'bangkok-vs-bali', title: 'Bangkok vs Bali: Cost of Living Comparison 2026', desc: 'Two top nomad destinations head to head. Which is cheaper, safer and better for remote workers?', category: 'Asia', date: 'February 2026', readTime: '7 min' },
    { slug: 'cheapest-cities-latin-america', title: 'Cheapest Cities in Latin America for Expats 2026', desc: 'Medellín, Mexico City, Buenos Aires — where to live well in LatAm without breaking the bank.', category: 'Latin America', date: 'February 2026', readTime: '8 min' },
    { slug: 'retire-abroad-cheap-countries', title: 'Best Countries to Retire Abroad on a Small Budget', desc: 'Retire early or stretch your pension further. The best affordable countries with quality healthcare.', category: 'Retirement', date: 'January 2026', readTime: '9 min' },
    { slug: 'digital-nomad-visa-guide', title: 'Digital Nomad Visa Guide 2026: Every Country Compared', desc: 'Which countries offer digital nomad visas? Requirements, costs and processing times all compared.', category: 'Visas', date: 'January 2026', readTime: '11 min' },
    { slug: 'numbeo-vs-roamcost', title: 'RoamCost vs Numbeo: Which Cost of Living Tool is Better?', desc: 'How do the leading cost of living comparison tools stack up? We compared features, data accuracy and usability.', category: 'Tools', date: 'December 2025', readTime: '5 min' },
];

const CATEGORY_COLORS: Record<string, string> = {
    Europe: '#52B788', Asia: '#3b82f6', Nomads: '#8b5cf6',
    Budget: '#F7831E', 'Latin America': '#ef4444', Retirement: '#f59e0b',
    Visas: '#06b6d4', Tools: '#64748b',
    'World Cup 2026': '#FFD700',
    'North America': '#3b82f6',
};

export default function BlogPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#0f172a', padding: '3rem 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>RoamCost Blog</p>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
                        Cost of Living Guides & Travel Insights
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: 0, maxWidth: '600px' }}>
                        Data-driven guides for digital nomads, expats and travelers. Real numbers, real cities.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* Featured post */}
                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#52B788', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Featured</span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{POSTS[0].title}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>{POSTS[0].desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{POSTS[0].date}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{POSTS[0].readTime} read</span>
                        </div>
                        <Link href={`/blog/${POSTS[0].slug}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#52B788', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', width: 'fit-content' }}>
                            Read guide →
                        </Link>
                    </div>
                    <div style={{ backgroundColor: '#D8F3DC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&h=400&q=80"
                            alt="Cheapest cities Europe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                    {POSTS.slice(1).map(post => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, color: 'white', backgroundColor: CATEGORY_COLORS[post.category] || '#64748b', padding: '0.2rem 0.6rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                                        {post.category}
                                    </span>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.625rem', lineHeight: 1.3 }}>{post.title}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{post.desc}</p>
                                </div>
                                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{post.date}</span>
                                    <span style={{ fontSize: '0.72rem', color: '#52B788', fontWeight: 700 }}>{post.readTime} read</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

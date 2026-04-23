import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ slug: string }> }

const POSTS: Record<string, {
    title: string; desc: string; category: string; date: string; readTime: string;
    keywords: string; image: string; content: string;
}> = {
    'cheapest-cities-europe-2026': {
        title: 'Cheapest Cities to Live in Europe in 2026',
        desc: 'From Lisbon to Tbilisi — the most affordable European cities with full cost breakdowns for rent, food and transport.',
        category: 'Europe', date: 'April 2026', readTime: '8 min',
        keywords: 'cheapest cities europe, affordable cities europe 2026, cheapest places to live europe, cheap european cities expats',
        image: 'photo-1541849546-216549ae216d',
        content: `
## The Most Affordable Cities in Europe for 2026

Europe doesn't have to be expensive. While Paris and Zurich can drain your budget fast, a growing number of European cities offer excellent quality of life at a fraction of the cost. We analyzed rent, food, transport and safety data across 200+ European cities to find the best value destinations.

## Top 10 Cheapest Cities in Europe

### 1. Tbilisi, Georgia — ~$800/month
Georgia's capital consistently ranks as one of the most affordable cities for expats and digital nomads. Rent for a one-bedroom apartment in the center runs about $400-500/month, and a meal at a local restaurant costs $3-5. Georgia also offers a special visa-free stay of up to 365 days for most nationalities.

### 2. Chișinău, Moldova — ~$700/month
The least-visited capital in Europe is also one of the cheapest. Moldova's low cost of living makes it attractive for remote workers, though infrastructure is improving rapidly.

### 3. Skopje, North Macedonia — ~$750/month
Skopje offers a surprising quality of life at very low cost. The city has been heavily renovated in recent years and offers a walkable old bazaar district, good restaurants and warm summers.

### 4. Belgrade, Serbia — ~$900/month
Serbia's capital has become a major digital nomad hub thanks to its nightlife, coworking scene and low costs. Rent averages $500-600/month for a modern apartment.

### 5. Kyiv, Ukraine — pre-war ~$700/month
Before 2022 Kyiv was one of Europe's most affordable capitals. Monitor the situation for future opportunities.

### 6. Bucharest, Romania — ~$1,000/month
Romania's capital offers fast internet (some of the fastest in Europe), a growing tech scene and low costs compared to Western Europe. English is widely spoken.

### 7. Sofia, Bulgaria — ~$950/month
Bulgaria is an EU member with euro-adjacent costs. Sofia has a growing expat community, good coffee shops and coworking spaces.

### 8. Warsaw, Poland — ~$1,200/month
Poland offers EU membership, great infrastructure and significantly lower costs than Western Europe. Warsaw is a modern, safe city with excellent transport.

### 9. Lisbon, Portugal — ~$1,800/month
Lisbon has gotten more expensive in recent years but still beats London, Paris or Amsterdam significantly. The D8 Digital Nomad Visa makes it easy to stay legally.

### 10. Budapest, Hungary — ~$1,100/month
Budapest combines stunning architecture, excellent food and nightlife with costs well below its Western neighbors.

## Monthly Cost Breakdown Comparison

| City | Rent (1BR center) | Food/month | Transport | Total est. |
|------|------------------|------------|-----------|------------|
| Tbilisi | $400 | $200 | $30 | ~$800 |
| Belgrade | $550 | $250 | $30 | ~$900 |
| Bucharest | $600 | $280 | $40 | ~$1,000 |
| Budapest | $700 | $300 | $50 | ~$1,100 |
| Lisbon | $1,200 | $400 | $60 | ~$1,800 |

## FAQ

**What is the cheapest country in Europe to live in?**
Moldova and Georgia (borderline European) consistently rank as the cheapest. Within the EU, Romania and Bulgaria offer the lowest costs.

**Is it cheaper to live in Eastern or Western Europe?**
Eastern Europe is significantly cheaper — often 40-60% less than equivalent cities in France, Germany or the UK.

**Can I live in Europe on $1,500/month?**
Yes, comfortably in many Eastern European cities like Bucharest, Sofia, Belgrade or Tbilisi. Lisbon and Porto are possible but tight.
        `
    },
    'best-cities-digital-nomads-2026': {
        title: 'Best Cities for Digital Nomads in 2026',
        desc: 'Fast internet, coworking spaces, visa options and affordability. The definitive nomad city guide for 2026.',
        category: 'Nomads', date: 'April 2026', readTime: '10 min',
        keywords: 'best cities digital nomads 2026, digital nomad destinations, remote work cities, best places work remotely 2026',
        image: 'photo-1525625293386-3f8f99389edd',
        content: `
## Best Cities for Digital Nomads in 2026

The rise of remote work has created a new generation of travelers who work from anywhere. After analyzing internet speeds, coworking availability, visa options, cost and community size, these are the top cities for digital nomads in 2026.

## What Makes a Great Nomad City?

The ideal digital nomad city combines fast, reliable internet (50+ Mbps minimum), affordable cost of living, a welcoming visa policy, a community of other remote workers, good coffee shops and coworking spaces, and a reasonable time zone for your clients.

## Top 10 Digital Nomad Cities

### 1. Lisbon, Portugal
Lisbon has earned its place as Europe's top nomad hub. The D8 Digital Nomad Visa allows stays of up to 2 years. Internet averages 100+ Mbps, coworking spaces are abundant, and the city's mild climate and vibrant culture make it deeply livable. Monthly costs run $1,800-2,500.

### 2. Chiang Mai, Thailand
The original digital nomad city still delivers. $800-1,200/month buys an excellent lifestyle with fast internet, hundreds of cafes ideal for working, warm weather year-round and a massive international community.

### 3. Medellín, Colombia
Colombia's "City of Eternal Spring" has transformed into one of Latin America's top nomad destinations. El Poblado neighborhood has cafes, coworking and nightlife. Costs run $1,000-1,500/month.

### 4. Tbilisi, Georgia
Georgia's 365-day visa-free policy and low costs ($800/month) have made Tbilisi a major nomad hub. Fast internet, excellent food and a growing coworking scene.

### 5. Bangkok, Thailand
For nomads who want a big-city experience, Bangkok offers everything: fast internet, thousands of cafes, excellent food, great hospitals and a Thailand LTR Visa for longer stays. Budget $1,200-1,800/month.

### 6. Bali, Indonesia
Canggu and Seminyak are established nomad enclaves. The Bali Social Visa allows 6-month stays. Costs $1,000-1,500/month in Canggu. Coworking spaces are everywhere.

### 7. Mexico City, Mexico
CDMX has exploded as a nomad destination. Roma and Condesa neighborhoods have world-class restaurants, excellent internet and a massive international community. Budget $1,500-2,000/month.

### 8. Seoul, South Korea
For tech-focused nomads, Seoul offers some of the world's fastest internet, a cutting-edge city and fascinating culture. Costs are moderate at $1,500-2,000/month.

### 9. Playa del Carmen, Mexico
A beach alternative to CDMX with strong nomad infrastructure, warm weather and lower costs (~$1,200/month).

### 10. Tallinn, Estonia
Estonia's e-Residency and Digital Nomad Visa make it the most nomad-friendly country in the EU officially. Costs are moderate but the city is compact and highly livable.

## FAQ

**What internet speed do I need as a digital nomad?**
For video calls, 25 Mbps upload is sufficient. For heavy video work, aim for 50+ Mbps upload. Always test hotel/Airbnb internet before booking long-term.

**Which city has the best digital nomad visa?**
Estonia has the most established official program. Portugal's D8 Visa is popular for Europe. Thailand's LTR Visa and Georgia's 365-day visa-free are great for Asia and Caucasus.

**Can I be a digital nomad on $2,000/month?**
Yes — in Southeast Asia, Eastern Europe or Latin America you can live very comfortably. In Western Europe or Japan, $2,000/month is tight but possible.
        `
    },
    'live-on-2000-month': {
        title: 'Best Cities to Live Comfortably on $2,000/Month',
        desc: 'Which cities give you a great lifestyle for $2,000/month? We crunched the data across 45,000 cities.',
        category: 'Budget', date: 'March 2026', readTime: '6 min',
        keywords: 'live on 2000 a month, best cities 2000 month budget, affordable cities for expats, cheap cities good quality life',
        image: 'photo-1477959858617-67f85cf4f1df',
        content: `
## Best Cities to Live Comfortably on $2,000/Month in 2026

$2,000 per month — about $24,000/year — is a budget that stretches dramatically depending on where you live. In San Francisco or London, it barely covers rent. In Bangkok or Lisbon, it funds an excellent lifestyle. Here's where your $2,000/month goes furthest.

## Tier 1: Excellent Lifestyle ($2,000/month buys a lot)

**Chiang Mai, Thailand** — At $1,000-1,200/month average, $2,000 gets you a premium apartment, daily restaurant meals, gym membership, regular massages and travel on weekends. You'll save $800/month.

**Medellín, Colombia** — $1,200-1,500/month for a great lifestyle. $2,000 gets you a nice apartment in El Poblado, excellent food and plenty left over.

**Lisbon, Portugal** — $1,800-2,000/month for a comfortable life. $2,000 is tight but doable, especially if you cook at home.

**Tbilisi, Georgia** — $800-1,000/month average. $2,000 is more than enough for an excellent lifestyle with money to spare.

## Tier 2: Good Lifestyle ($2,000/month is comfortable)

**Mexico City** — $1,500-1,800/month in Roma/Condesa neighborhoods. $2,000 gives you comfort.

**Bangkok, Thailand** — $1,200-1,500/month. A solid option for a city lifestyle with great food.

**Bucharest, Romania** — $1,000-1,200/month. Great value in the EU.

**Prague, Czech Republic** — $1,400-1,700/month. Beautiful city, EU safety, reasonable costs.

## Tier 3: Possible but Tight ($2,000/month requires budgeting)

**Barcelona, Spain** — $2,000-2,200/month. Tight but possible with careful budgeting.

**Berlin, Germany** — $2,000-2,300/month. You'll need to be careful but it's doable.

## FAQ

**What's included in the $2,000/month estimate?**
Our estimates include a one-bedroom apartment in a decent neighborhood, food (mix of cooking and eating out), local transport, utilities, internet and a small discretionary budget.

**Is $2,000/month enough to retire abroad?**
In Southeast Asia, Eastern Europe and parts of Latin America, yes — $2,000/month funds a comfortable retirement. Use our compare tool to find your perfect city.
        `
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = POSTS[slug];
    if (!post) return { title: 'Post Not Found' };
    return {
        title: `${post.title} | RoamCost`,
        description: post.desc,
        keywords: post.keywords,
        openGraph: { title: post.title, description: post.desc, url: `https://www.roamcost.com/blog/${slug}`, type: 'article' },
        alternates: { canonical: `https://www.roamcost.com/blog/${slug}` },
    };
}

export async function generateStaticParams() {
    return Object.keys(POSTS).map(slug => ({ slug }));
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = POSTS[slug];
    if (!post) return notFound();

    const GREEN = '#52B788';
    const CATEGORY_COLORS: Record<string, string> = {
        Europe: '#52B788', Asia: '#3b82f6', Nomads: '#8b5cf6',
        Budget: '#F7831E', 'Latin America': '#ef4444',
    };

    // Related posts
    const related = Object.entries(POSTS).filter(([s]) => s !== slug).slice(0, 3);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Hero */}
            <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
                <img src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1400&h=350&q=80`}
                    alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2rem 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
                    <nav style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.5rem' }}>→</span>
                        <Link href="/blog" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</Link>
                        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.5rem' }}>→</span>
                        <span style={{ color: 'white' }}>{post.category}</span>
                    </nav>
                    <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, color: 'white', backgroundColor: CATEGORY_COLORS[post.category] || '#64748b', padding: '0.2rem 0.7rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        {post.category}
                    </span>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', margin: '0 0 0.75rem', letterSpacing: '-0.03em', lineHeight: 1.2, maxWidth: '700px' }}>{post.title}</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{post.date}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>·</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{post.readTime} read</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'start' }}>
                {/* Article */}
                <article>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', border: '1px solid #e2e8f0', lineHeight: 1.8, color: '#334155', fontSize: '1rem' }}>
                        <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.7, fontStyle: 'italic', borderLeft: `4px solid ${GREEN}`, paddingLeft: '1rem' }}>{post.desc}</p>

                        {/* Render markdown-like content */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '2rem 0 0.75rem', letterSpacing: '-0.02em' }}>{line.slice(3)}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '1.5rem 0 0.5rem' }}>{line.slice(4)}</h3>;
                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{ fontWeight: 700, color: '#0f172a', margin: '0.75rem 0 0.25rem' }}>{line.slice(2, -2)}</p>;
                            if (line.startsWith('| ')) return null; // Skip table rows for now
                            if (line.trim() === '') return <div key={i} style={{ height: '0.5rem' }} />;
                            return <p key={i} style={{ margin: '0 0 0.875rem', lineHeight: 1.8 }}>{line}</p>;
                        })}
                    </div>

                    {/* CTA */}
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Compare cities yourself with real data</p>
                        <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1.5rem' }}>Find your perfect city on RoamCost</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/compare" style={{ backgroundColor: GREEN, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>Compare cities →</Link>
                            <Link href="/rankings/cheapest" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.2)' }}>See rankings →</Link>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontSize: '0.9rem' }}>Quick tools</h4>
                        {[
                            { href: '/compare', label: 'Compare two cities' },
                            { href: '/rankings/cheapest', label: 'Cheapest cities' },
                            { href: '/rankings/nomads', label: 'Best for nomads' },
                            { href: '/rankings/safest', label: 'Safest cities' },
                            { href: '/calculator', label: 'Currency converter' },
                        ].map(l => (
                            <Link key={l.href} href={l.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                                {l.label}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        ))}
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontSize: '0.9rem' }}>More articles</h4>
                        {related.map(([s, p]) => (
                            <Link key={s} href={`/blog/${s}`} style={{ display: 'block', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.2rem' }}>{p.title}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.readTime} read</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

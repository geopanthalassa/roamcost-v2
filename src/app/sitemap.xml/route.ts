import { supabase } from '@/lib/supabase';

const BASE = 'https://www.roamcost.com';

const POPULAR_PAIRS = [
    'paris-vs-london', 'tokyo-vs-seoul', 'barcelona-vs-lisbon',
    'new-york-vs-london', 'bangkok-vs-singapore', 'berlin-vs-amsterdam',
    'buenos-aires-vs-bogota', 'dubai-vs-singapore', 'miami-vs-barcelona',
    'tokyo-vs-bangkok', 'london-vs-amsterdam', 'paris-vs-berlin',
];

function generateSiteMap(cities: any[]) {
    const staticUrls = [
        { loc: BASE, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE}/compare`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE}/calculator`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE}/rankings/cheapest`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${BASE}/rankings/nomads`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${BASE}/rankings/safest`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${BASE}/rankings/quality`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${BASE}/about`, priority: '0.5', changefreq: 'monthly' },
    ];

    const compareUrls = POPULAR_PAIRS.map(pair => ({
        loc: `${BASE}/compare/${pair}`, priority: '0.8', changefreq: 'weekly'
    }));

    const cityUrls = cities.flatMap(({ slug, city, country }) => {
        const citySlug = (city || '').toLowerCase().replace(/ /g, '-');
        const regionSlug = (country || '').toLowerCase().replace(/ /g, '-');
        return [
            { loc: `${BASE}/city/${slug}`, priority: '0.7', changefreq: 'weekly' },
            { loc: `${BASE}/cost-of-living-in-${citySlug}`, priority: '0.6', changefreq: 'monthly' },
            { loc: `${BASE}/best-cities-in-${regionSlug}`, priority: '0.5', changefreq: 'monthly' },
            { loc: `${BASE}/cheapest-cities-in-${regionSlug}`, priority: '0.5', changefreq: 'monthly' },
        ];
    });

    const allUrls = [...staticUrls, ...compareUrls, ...cityUrls];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export async function GET() {
    const { data: cities } = await supabase
        .from('cities_master')
        .select('slug, city, country')
        .gt('cost_index', 0)
        .limit(10000);

    const sitemap = generateSiteMap(cities || []);
    return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}

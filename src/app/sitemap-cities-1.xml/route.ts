import { supabase } from '@/lib/supabase';
const BASE = 'https://www.roamcost.com';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
    const allCities: { slug: string; city: string }[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
        const { data, error } = await supabase
            .from('cities_master')
            .select('slug, city')
            .gt('cost_index', 0)
            .order('slug', { ascending: true })
            .range(from, from + pageSize - 1);
        const rows = (data || []) as unknown as { slug: string; city: string }[];
        if (error) {
            console.error('Sitemap fetch error at offset', from, ':', error.message);
            break;
        }
        if (rows.length === 0) break;
        allCities.push(...rows);
        if (rows.length < pageSize) break;
        from += pageSize;
    }

    const midpoint = Math.ceil(allCities.length / 2);
    const half = allCities.slice(0, midpoint);

    const cityUrls = half.flatMap(({ slug, city }) => {
        const citySlug = (city || '').toLowerCase().replace(/ /g, '-');
        return [
            { loc: `${BASE}/city/${slug}`, priority: '0.7', changefreq: 'weekly' },
            { loc: `${BASE}/cost-of-living-in-${citySlug}`, priority: '0.6', changefreq: 'monthly' },
        ];
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

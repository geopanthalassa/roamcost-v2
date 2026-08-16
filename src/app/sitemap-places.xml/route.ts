import { supabase } from '@/lib/supabase';
const BASE = 'https://www.roamcost.com';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { data } = await supabase
        .from('city_places')
        .select('city_slug');

    const rows = (data || []) as unknown as { city_slug: string }[];
    const uniqueSlugs = Array.from(new Set(rows.map(r => r.city_slug)));

    const urls = uniqueSlugs.map(slug => ({
        loc: `${BASE}/city/${slug}/places`,
        priority: '0.6',
        changefreq: 'monthly',
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

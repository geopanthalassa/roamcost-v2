const BASE = 'https://www.roamcost.com';

export async function GET() {
    const sitemaps = [
        `${BASE}/sitemap-main.xml`,
        `${BASE}/sitemap-cities-1.xml`,
        `${BASE}/sitemap-cities-2.xml`,
        `${BASE}/sitemap-places.xml`,
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(loc => `  <sitemap>
    <loc>${loc}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

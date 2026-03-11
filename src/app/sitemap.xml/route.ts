import { supabase } from '@/lib/supabase';

const EXTERNAL_DATA_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roamcost.com';

function generateSiteMap(cities: any[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/rankings/cheapest</loc>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/rankings/nomads</loc>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/rankings/safest</loc>
     </url>
     ${cities
            .map(({ slug, city, country }) => {
                const citySlug = city.toLowerCase().replace(/ /g, '-');
                const regionSlug = country.toLowerCase().replace(/ /g, '-');
                return `
       <url><loc>${`${EXTERNAL_DATA_URL}/city/${slug}`}</loc></url>
       <url><loc>${`${EXTERNAL_DATA_URL}/city/${slug}/things-to-do`}</loc></url>
       <url><loc>${`${EXTERNAL_DATA_URL}/cost-of-living-in-${citySlug}`}</loc></url>
       <url><loc>${`${EXTERNAL_DATA_URL}/best-cities-in-${regionSlug}`}</loc></url>
       <url><loc>${`${EXTERNAL_DATA_URL}/cheapest-cities-in-${regionSlug}`}</loc></url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

export async function GET() {
    // We fetch only slugs to keep the memory footprint low
    const { data: cities } = await supabase
        .from('cities_master')
        .select('slug')
        .limit(40000); // Sitemaps have a 50k URL limit per file

    const sitemap = generateSiteMap(cities || []);

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

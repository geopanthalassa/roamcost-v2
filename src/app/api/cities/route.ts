import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FIELDS = 'slug,city,country,rent_index,food_index,transport_index,utilities_index,safety,internet,healthcare,cost_index,population';

async function supaFetch(path: string) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` },
        cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status}: ${text}`);
    return JSON.parse(text);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugsParam = searchParams.get('slugs');
    const searchParam = searchParams.get('search');
    const debugParam = searchParams.get('debug');

    try {
        if (debugParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country&city=ilike.*${encodeURIComponent(debugParam)}*&order=population.desc&limit=10`
            );
            return NextResponse.json(data);
        }

        if (slugsParam) {
            const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
            
            // Try exact slugs
            let data = await supaFetch(
                `cities_master?select=${FIELDS}&slug=in.(${slugList.join(',')})`
            );
            
            // For any not found, try without country suffix
            const foundSlugs = new Set(data.map((c: any) => c.slug));
            const notFound = slugList.filter(s => !foundSlugs.has(s));
            
            if (notFound.length > 0) {
                // Strip country suffix: barcelona-spain -> barcelona
                const stripped = notFound.map(s => {
                    const parts = s.split('-');
                    // Try removing last word if it looks like a country
                    return parts.slice(0, -1).join('-') || s;
                });
                const extra = await supaFetch(
                    `cities_master?select=${FIELDS}&slug=in.(${stripped.join(',')})`
                ).catch(() => []);
                data = [...data, ...extra];
            }
            
            return NextResponse.json(data);
        }

        if (searchParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country,population&city=ilike.*${encodeURIComponent(searchParam)}*&order=population.desc&limit=8`
            );
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Use ?slugs=, ?search= or ?debug=' }, { status: 400 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

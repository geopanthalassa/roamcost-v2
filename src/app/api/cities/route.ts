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

// Smart slug resolver - tries multiple strategies to find a city
async function resolveSlug(slug: string): Promise<any | null> {
    // 1. Exact slug match
    const exact = await supaFetch(`cities_master?select=${FIELDS}&slug=eq.${encodeURIComponent(slug)}&limit=1`).catch(() => []);
    if (exact.length > 0) return exact[0];

    // 2. Strip country suffix (barcelona-spain -> barcelona)
    const parts = slug.split('-');
    if (parts.length > 1) {
        const stripped = parts.slice(0, -1).join('-');
        const s2 = await supaFetch(`cities_master?select=${FIELDS}&slug=eq.${encodeURIComponent(stripped)}&limit=1`).catch(() => []);
        if (s2.length > 0) return s2[0];
    }

    // 3. Search by city name (slug -> city name)
    const cityName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const byName = await supaFetch(
        `cities_master?select=${FIELDS}&city=ilike.${encodeURIComponent(cityName)}&order=population.desc&limit=1`
    ).catch(() => []);
    if (byName.length > 0) return byName[0];

    // 4. Partial match
    const partial = await supaFetch(
        `cities_master?select=${FIELDS}&city=ilike.*${encodeURIComponent(parts[0])}*&order=population.desc&limit=1`
    ).catch(() => []);
    if (partial.length > 0) return partial[0];

    return null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugsParam = searchParams.get('slugs');
    const searchParam = searchParams.get('search');
    const debugParam = searchParams.get('debug');

    try {
        if (debugParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country,population&city=ilike.*${encodeURIComponent(debugParam)}*&order=population.desc&limit=10`
            );
            return NextResponse.json(data);
        }

        if (slugsParam) {
            const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
            
            // Resolve each slug independently with smart fallbacks
            const results = await Promise.all(slugList.map(s => resolveSlug(s)));
            const found = results.filter(Boolean);
            
            return NextResponse.json(found);
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

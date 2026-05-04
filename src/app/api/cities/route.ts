import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FIELDS = 'slug,city,country,rent_index,food_index,transport_index,utilities_index,safety,internet,healthcare,cost_index,population,rent_usd,food_usd,transport_usd,total_usd';

async function supaFetch(path: string) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` },
        cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status}: ${text}`);
    return JSON.parse(text);
}

// Find a city using multiple strategies
async function findCity(slug: string): Promise<any | null> {
    // 1. Exact slug match
    const exact = await supaFetch(
        `cities_master?select=${FIELDS}&slug=eq.${encodeURIComponent(slug)}&limit=1`
    ).catch(() => []);
    if (exact.length > 0) return exact[0];

    // 2. Search by city name (convert slug to name: prague â†’ prague, new-york â†’ new york)
    const cityName = slug.replace(/-/g, ' ');
    const byName = await supaFetch(
        `cities_master?select=${FIELDS}&city=ilike.${encodeURIComponent(cityName)}&order=population.desc&limit=1`
    ).catch(() => []);
    if (byName.length > 0) return byName[0];

    // 3. Partial match - find any city starting with first word
    const firstWord = slug.split('-')[0];
    if (firstWord.length > 3) {
        const partial = await supaFetch(
            `cities_master?select=${FIELDS}&city=ilike.${encodeURIComponent(firstWord)}*&order=population.desc&limit=1`
        ).catch(() => []);
        if (partial.length > 0) return partial[0];
    }

    return null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugsParam  = searchParams.get('slugs');
    const searchParam = searchParams.get('search');
    const debugParam  = searchParams.get('debug');

    try {
        // Debug: find city by name
        if (debugParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country&city=ilike.*${encodeURIComponent(debugParam)}*&order=population.desc&limit=10`
            );
            return NextResponse.json(data);
        }

        // Compare: find each city with smart fallback
        if (slugsParam) {
            const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
            const results = await Promise.all(slugList.map(findCity));
            const found = results.filter(Boolean);
            return NextResponse.json(found);
        }

        // Search autocomplete
        if (searchParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country,population&city=ilike.*${encodeURIComponent(searchParam)}*&order=population.desc&limit=8`
            );
            return NextResponse.json(Array.isArray(data) ? data : []);
        }

        return NextResponse.json({ error: 'Use ?slugs=, ?search= or ?debug=' }, { status: 400 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


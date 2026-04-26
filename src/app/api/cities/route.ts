import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supaFetch(path: string) {
    const url = `${SUPA_URL}/rest/v1/${path}`;
    const res = await fetch(url, {
        headers: {
            'apikey': SUPA_KEY,
            'Authorization': `Bearer ${SUPA_KEY}`,
        },
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
        // Debug endpoint to find real slugs
        if (debugParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country&city=ilike.*${encodeURIComponent(debugParam)}*&order=population.desc&limit=10`
            );
            return NextResponse.json(data);
        }

        if (slugsParam) {
            const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
            const data = await supaFetch(
                `cities_master?select=slug,city,country,rent_index,food_index,transport_index,utilities_index,safety,internet,healthcare,cost_index,population&slug=in.(${slugList.join(',')})`
            );
            return NextResponse.json({ data, requested: slugList, found: data.map((c: any) => c.slug) });
        }

        if (searchParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country,population&city=ilike.*${encodeURIComponent(searchParam)}*&order=population.desc&limit=8`
            );
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Use ?slugs= or ?search= or ?debug=' }, { status: 400 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message, url: SUPA_URL }, { status: 500 });
    }
}

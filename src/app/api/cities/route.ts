import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supaFetch(path: string) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
        headers: {
            'apikey': SUPA_KEY,
            'Authorization': `Bearer ${SUPA_KEY}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase error: ${res.status} ${text}`);
    }
    return res.json();
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugsParam = searchParams.get('slugs');
    const searchParam = searchParams.get('search');

    try {
        if (slugsParam) {
            const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
            const data = await supaFetch(
                `cities_master?select=slug,city,country,rent_index,food_index,transport_index,utilities_index,safety,internet,healthcare,cost_index,population&slug=in.(${slugList.join(',')})`
            );
            return NextResponse.json(data);
        }

        if (searchParam) {
            const data = await supaFetch(
                `cities_master?select=slug,city,country,population&city=ilike.*${encodeURIComponent(searchParam)}*&order=population.desc&limit=8`
            );
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    } catch (err: any) {
        console.error('Cities API error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugsParam = searchParams.get('slugs');
    const searchParam = searchParams.get('search');

    if (slugsParam) {
        const slugList = slugsParam.split(',').filter(Boolean).slice(0, 4);
        const { data, error } = await supabase
            .from('cities_master')
            .select('slug,city,country,rent_index,food_index,transport_index,utilities_index,safety,internet,healthcare,cost_index,population')
            .in('slug', slugList);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    if (searchParam) {
        const { data, error } = await supabase
            .from('cities_master')
            .select('slug,city,country,population')
            .ilike('city', `%${searchParam}%`)
            .order('population', { ascending: false })
            .limit(8);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
}

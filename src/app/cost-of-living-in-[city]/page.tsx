import { redirect, notFound } from 'next/navigation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function findSlug(city: string): Promise<string | null> {
    // 1. Exact slug match
    const r1 = await fetch(
        `${SUPABASE_URL}/rest/v1/cities_master?select=slug&slug=eq.${encodeURIComponent(city)}&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, cache: 'no-store' }
    );
    const d1 = await r1.json();
    if (d1?.[0]?.slug) return d1[0].slug;

    // 2. City name match (slug → city name)
    const cityName = city.replace(/-/g, ' ');
    const r2 = await fetch(
        `${SUPABASE_URL}/rest/v1/cities_master?select=slug&city=ilike.${encodeURIComponent(cityName)}&order=population.desc&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, cache: 'no-store' }
    );
    const d2 = await r2.json();
    if (d2?.[0]?.slug) return d2[0].slug;

    return null;
}

export default async function CostOfLivingRedirect({ params }: { params: Promise<{ city: string }> }) {
    const { city } = await params;
    const slug = await findSlug(city);
    if (!slug) notFound();
    redirect(`/city/${slug}`);
}

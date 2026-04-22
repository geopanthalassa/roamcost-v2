import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';

interface SEOPageProps {
    params: Promise<{ city: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: SEOPageProps) {
    const { city } = await params;
    const name = city.replace(/-/g, ' ');
    return {
        title: `Cost of Living in ${name} 2026 | RoamCost`,
        description: `Complete guide to living costs in ${name}: rent, food, transport, safety and quality of life. Updated 2026 data.`,
    };
}

export default async function CostOfLivingCityPage({ params }: SEOPageProps) {
    const { city: cityParam } = await params;
    const cityName = cityParam.replace(/-/g, ' ');

    const { data: city } = await supabase
        .from('cities_master')
        .select('slug')
        .ilike('city', cityName)
        .single() as unknown as { data: { slug: string } | null };

    if (!city) notFound();

    // Redirect to canonical city URL
    redirect(`/city/${city.slug}`);
}

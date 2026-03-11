import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import CityPage from '../city/[slug]/page';

import { City } from '@/types/database';

interface SEOPageProps {
    params: Promise<{
        city: string;
    }>;
}

// We reuse the CityPage logic but under an SEO-friendly URL
export default async function CostOfLivingCityPage({ params }: SEOPageProps) {
    const { city: cityName } = await params;
    const { data: city } = await supabase
        .from('cities_master')
        .select('slug')
        .ilike('city', cityName.replace(/-/g, ' '))
        .single() as unknown as { data: { slug: string } | null };

    if (!city) {
        notFound();
    }

    // Reuse the logic from city/[slug]
    return <CityPage params={Promise.resolve({ slug: city.slug })} />;
}

export async function generateMetadata({ params }: SEOPageProps) {
    const { city } = await params;
    const name = city.replace(/-/g, ' ').toUpperCase();
    return {
        title: `Cost of Living in ${name} | RoamCost`,
        description: `Expert guide to prices, rent, and quality of life in ${name}. Compare ${name} with other global cities.`,
    };
}

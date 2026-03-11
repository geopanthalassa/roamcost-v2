import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import CityPage from '../city/[slug]/page';

interface SEOPageProps {
    params: {
        city: string;
    };
}

// We reuse the CityPage logic but under an SEO-friendly URL
export default async function CostOfLivingCityPage({ params }: SEOPageProps) {
    const { data: city } = await supabase
        .from('cities_master')
        .select('slug')
        .ilike('city', params.city.replace(/-/g, ' '))
        .single();

    if (!city) {
        notFound();
    }

    // Reuse the logic from city/[slug]
    return <CityPage params={{ slug: city.slug }} />;
}

export async function generateMetadata({ params }: SEOPageProps) {
    const name = params.city.replace(/-/g, ' ').toUpperCase();
    return {
        title: `Cost of Living in ${name} | RoamCost`,
        description: `Expert guide to prices, rent, and quality of life in ${name}. Compare ${name} with other global cities.`,
    };
}

import { supabase } from '@/lib/supabase';

export async function getDestinationSlugs(): Promise<string[]> {
    const slugs = new Set<string>();
    let from = 0;
    while (true) {
        const { data, error } = await supabase.from('city_places').select('city_slug').range(from, from + 999);
        const rows = (data || []) as unknown as { city_slug: string }[];
        if (error || rows.length === 0) break;
        rows.forEach(r => slugs.add(r.city_slug));
        if (rows.length < 1000) break;
        from += 1000;
    }
    return Array.from(slugs);
}

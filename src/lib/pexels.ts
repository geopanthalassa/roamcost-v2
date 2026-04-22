// src/lib/pexels.ts
import { getCityImage as getStaticImage } from './cityImages';

const PEXELS_KEY = process.env.PEXELS_API_KEY;

export async function getCityImage(cityName: string, countryName: string, slug?: string): Promise<string> {
    // If no Pexels key, use our curated static images
    if (!PEXELS_KEY) {
        return getStaticImage(slug || cityName.toLowerCase().replace(/ /g, '-'), 1400, 600);
    }

    try {
        const query = encodeURIComponent(`${cityName} ${countryName} cityscape`);
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
            { headers: { Authorization: PEXELS_KEY }, next: { revalidate: 86400 } }
        );
        if (!res.ok) return getStaticImage(slug || cityName.toLowerCase().replace(/ /g, '-'), 1400, 600);
        const data = await res.json();
        return data?.photos?.[0]?.src?.large2x ?? getStaticImage(slug || cityName.toLowerCase().replace(/ /g, '-'), 1400, 600);
    } catch {
        return getStaticImage(slug || cityName.toLowerCase().replace(/ /g, '-'), 1400, 600);
    }
}

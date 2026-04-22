// src/lib/pexels.ts
// Fetches a real city photo from Pexels API
// Called server-side so the API key stays private

const PEXELS_KEY = process.env.PEXELS_API_KEY!;

// Fallback images per region in case Pexels fails
const FALLBACK_IMAGES: Record<string, string> = {
    default: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
    asia: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1400&q=80',
    europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80',
    americas: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1400&q=80',
};

export async function getCityImage(cityName: string, countryName: string): Promise<string> {
    if (!PEXELS_KEY) return FALLBACK_IMAGES.default;

    try {
        const query = encodeURIComponent(`${cityName} ${countryName} cityscape`);
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
            {
                headers: { Authorization: PEXELS_KEY },
                next: { revalidate: 86400 } // cache 24 hours
            }
        );

        if (!res.ok) return FALLBACK_IMAGES.default;

        const data = await res.json();
        const photo = data?.photos?.[0];

        if (!photo) {
            // Try just the city name if city+country returns nothing
            const res2 = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName + ' city')}&per_page=1&orientation=landscape`,
                {
                    headers: { Authorization: PEXELS_KEY },
                    next: { revalidate: 86400 }
                }
            );
            const data2 = await res2.json();
            return data2?.photos?.[0]?.src?.large2x ?? FALLBACK_IMAGES.default;
        }

        return photo.src.large2x;
    } catch {
        return FALLBACK_IMAGES.default;
    }
}

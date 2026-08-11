import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const photoName = req.nextUrl.searchParams.get('name');
    if (!photoName) {
        return new Response('Missing photo name', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return new Response('Server misconfigured', { status: 500 });
    }

    const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${apiKey}`;

    const res = await fetch(googleUrl);
    if (!res.ok) {
        return new Response('Photo not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=604800, immutable',
        },
    });
}

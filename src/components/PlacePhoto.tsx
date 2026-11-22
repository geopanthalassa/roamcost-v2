'use client';

import { useState } from 'react';

interface Props {
    photoName: string;
    alt: string;
    style?: React.CSSProperties;
}

// Shows a Google Places photo, and renders nothing if it fails to load
// so the card never shows a broken-image icon or alt text.
export default function PlacePhoto({ photoName, alt, style }: Props) {
    const [failed, setFailed] = useState(false);
    if (failed) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/api/places-photo?name=${encodeURIComponent(photoName)}`}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            style={style}
        />
    );
}

'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_ID = 'G-J2QKKP0J0C';

function GATracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window.gtag !== 'function') return;
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        window.gtag('config', GA_ID, { page_path: url });
    }, [pathname, searchParams]);

    return null;
}

export default function GoogleAnalytics() {
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                `}
            </Script>
            <Suspense fallback={null}>
                <GATracker />
            </Suspense>
        </>
    );
}

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}

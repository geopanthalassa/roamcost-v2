'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = 'G-J2QKKP0J0C';

export default function GoogleAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('config', GA_ID, { page_path: pathname });
        }
    }, [pathname]);

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
                    gtag('config', '${GA_ID}');
                `}
            </Script>
        </>
    );
}

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/context/CurrencyContext";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RoamCost | Compare Cost of Living Between Cities Worldwide",
    description: "Compare rent, food, safety, internet speed and quality of life between hundreds of cities worldwide. Free data for digital nomads, expats and travelers. Find the cheapest cities to live, work and travel.",
    keywords: "cost of living comparison, digital nomad cities, cheapest cities to live, expat guide, city comparison, where to live abroad, best cities for remote work, cost of living calculator, move abroad, retire abroad",
    openGraph: {
        title: "RoamCost — Compare Cost of Living Worldwide",
        description: "Data-driven city comparisons for digital nomads and expats. Find your perfect global base.",
        url: "https://www.roamcost.com",
        siteName: "RoamCost",
        type: "website",
        images: [{ url: "https://www.roamcost.com/favicon_512.png", width: 512, height: 512, alt: "RoamCost" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "RoamCost — Compare Cost of Living Worldwide",
        description: "Find your perfect city. Compare rent, safety, internet and more.",
    },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon_32.png', apple: '/favicon_512.png' },
    alternates: { canonical: 'https://www.roamcost.com' },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <meta name="google-translate-customization" content="9f35768e67a71c1-f03e73ef93656214-gd98f869974204e30-10" />
            </head>
            <body className={inter.className}>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-J2QKKP0J0C" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-J2QKKP0J0C');
                `}</Script>
                <CurrencyProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </CurrencyProvider>
            </body>
        </html>
    );
}

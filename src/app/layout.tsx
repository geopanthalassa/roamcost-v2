import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RoamCost | Compare Cost of Living Between Cities Worldwide",
    description: "Compare rent, food, safety, internet speed and quality of life between hundreds of cities worldwide. Free data for digital nomads, expats and travelers.",
    keywords: "cost of living comparison, digital nomad cities, cheapest cities to live, expat guide, city comparison",
    openGraph: {
        title: "RoamCost — Compare Cost of Living Worldwide",
        description: "Data-driven city comparisons for digital nomads and expats. Find your perfect global base.",
        url: "https://www.roamcost.com",
        siteName: "RoamCost",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "RoamCost — Compare Cost of Living Worldwide",
        description: "Find your perfect city. Compare rent, safety, internet and more.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <meta name="google-translate-customization" content="9f35768e67a71c1-f03e73ef93656214-gd98f869974204e30-10" />
                <link rel="canonical" href="https://www.roamcost.com" />
            </head>
            <body className={inter.className}>
                <CurrencyProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </CurrencyProvider>
            </body>
        </html>
    );
}

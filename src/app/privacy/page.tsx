export const metadata = {
    title: 'Privacy Policy | RoamCost',
    description: 'Privacy policy for RoamCost — how we handle your data.',
};

export default function PrivacyPage() {
    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Privacy Policy</h1>
            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last updated: January 2026</p>

            {[
                { title: 'Data we collect', body: 'RoamCost does not require account creation. We collect anonymous usage analytics (page views, city searches) to improve the platform. We do not sell or share personal data with third parties.' },
                { title: 'Cookies', body: 'We use minimal cookies for session management and currency preferences. We do not use advertising cookies. You can disable cookies in your browser settings at any time.' },
                { title: 'Third-party services', body: 'Our platform integrates with Supabase (database), Open-Meteo (weather, no API key needed), ExchangeRate-API (currency), and Google Translate. These services have their own privacy policies.' },
                { title: 'Affiliate links', body: 'City pages contain affiliate links to Booking.com, Kiwi.com and Airbnb. Clicking these links may result in a small commission for RoamCost at no extra cost to you.' },
                { title: 'Contact', body: 'For any privacy-related questions, please use our contact form or reach out via the About page.' },
            ].map(s => (
                <div key={s.title} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{s.title}</h2>
                    <p style={{ color: '#475569', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
                </div>
            ))}
        </div>
    );
}

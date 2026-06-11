export const metadata = {
    title: 'Cookie Policy | RoamCost',
    description: 'Cookie policy for RoamCost — how we use cookies and similar technologies.',
};

export default function CookiesPage() {
    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Cookie Policy</h1>
            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last updated: June 2026</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#374151', lineHeight: 1.8 }}>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>What are cookies?</h2>
                    <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>How RoamCost uses cookies</h2>
                    <p>RoamCost uses the following types of cookies:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Essential cookies:</strong> Required for the platform to function correctly, including currency preferences and comparison settings.</li>
                        <li><strong>Analytics cookies:</strong> We use Google Analytics to understand how visitors use RoamCost. This helps us improve the platform. Analytics data is anonymized.</li>
                        <li><strong>Advertising cookies:</strong> We use Google AdSense to display relevant advertisements. AdSense may use cookies to serve ads based on your interests.</li>
                        <li><strong>Affiliate cookies:</strong> When you click on affiliate links (Booking.com, Wise, RentalCars, GetYourGuide), those platforms may set their own cookies to track referrals.</li>
                    </ul>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Managing cookies</h2>
                    <p>You can control and delete cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of RoamCost. For more information on managing cookies, visit your browser's help section.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Third-party cookies</h2>
                    <p>Some of our partners, including Google Analytics, Google AdSense, Booking.com, Wise and GetYourGuide, may set cookies on your device. These are governed by the respective privacy policies of those companies.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Contact</h2>
                    <p>For questions about our cookie policy, contact us at roamcost@gmail.com.</p>
                </section>
            </div>
        </div>
    );
}
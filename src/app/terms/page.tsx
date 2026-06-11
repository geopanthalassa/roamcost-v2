export const metadata = {
    title: 'Terms of Service | RoamCost',
    description: 'Terms of service for RoamCost — the global cost of living comparison platform.',
};

export default function TermsPage() {
    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Terms of Service</h1>
            <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last updated: June 2026</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#374151', lineHeight: 1.8 }}>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
                    <p>By accessing or using RoamCost (roamcost.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>2. Use of Information</h2>
                    <p>RoamCost provides cost of living data for informational purposes only. All data is aggregated from public sources and user contributions. While we strive for accuracy, we cannot guarantee that all information is current, complete or accurate. You should independently verify any information before making financial, relocation or travel decisions.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>3. Intellectual Property</h2>
                    <p>All content on RoamCost, including text, graphics, logos, and data compilations, is the property of RoamCost and protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works without our express written permission.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>4. Third-Party Links</h2>
                    <p>RoamCost contains links to third-party websites including hotel booking, car rental, currency exchange and tour operator platforms. We may earn a commission when you click these links and make a purchase. This does not affect our editorial independence or the information we provide.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>5. Disclaimer of Warranties</h2>
                    <p>RoamCost is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>6. Limitation of Liability</h2>
                    <p>RoamCost shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the platform or its content.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>7. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of RoamCost after any changes constitutes acceptance of the new terms.</p>
                </section>
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>8. Contact</h2>
                    <p>For questions about these terms, contact us at roamcost@gmail.com.</p>
                </section>
            </div>
        </div>
    );
}
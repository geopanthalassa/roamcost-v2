export const metadata = {
    title: 'Contact RoamCost | Get in Touch',
    description: 'Contact the RoamCost team for data corrections, partnership inquiries, or general questions about our cost of living comparisons.',
};

export default function ContactPage() {
    return (
        <div className="container section animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>Get in touch</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>Questions, data corrections, partnerships — we'd love to hear from you.</p>
            </div>

            <div className="card" style={{ padding: '2.5rem', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Name</label>
                        <input type="text" placeholder="Your name" style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Email</label>
                        <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Subject</label>
                        <select style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                            <option>Data correction</option>
                            <option>Partnership inquiry</option>
                            <option>Add a city</option>
                            <option>General question</option>
                            <option>Bug report</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Message</label>
                        <textarea placeholder="Tell us more..." rows={5} style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                    <button className="btn btn-primary" style={{ padding: '1rem', fontWeight: 800, fontSize: '1rem' }}>
                        Send Message →
                    </button>
                </div>
            </div>
        </div>
    );
}

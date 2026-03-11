import Link from 'next/link';
import { City } from '@/types/database';

interface CityCardProps {
    city: City;
}

export default function CityCard({ city }: CityCardProps) {
    // Mock image based on city name for now, or just a colored background
    const placeholderImage = `https://source.unsplash.com/featured/?${city.city},${city.country}`;

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                height: '200px',
                backgroundColor: '#e2e8f0',
                backgroundImage: `url(${placeholderImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} />
            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{city.city}</h3>
                        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>{city.country}</p>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--accent)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: 700
                    }}>
                        {city.cost_index}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
                    <div>Rent: {city.rent_index}</div>
                    <div>Safety: {city.safety}</div>
                    <div>Internet: {city.internet}</div>
                </div>
            </div>
        </Link>
    );
}

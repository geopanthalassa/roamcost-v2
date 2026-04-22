import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch featured data for the homepage - Prioritizing recognizable global hubs
  const { data: featuredCities } = await supabase
    .from('cities_master')
    .select('*')
    .not('population', 'is', null)
    .gt('population', 2000000)
    .order('population', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  const { data: cheapestCities } = await supabase
    .from('cities_master')
    .select('*')
    .not('population', 'is', null)
    .gt('population', 1000000)
    .order('rent_index', { ascending: true })
    .limit(4) as unknown as { data: City[] };

  const { data: topNomadCities } = await supabase
    .from('cities_master')
    .select('*')
    .not('population', 'is', null)
    .gt('population', 1500000)
    .order('internet', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  return (
    <div className="homepage animate-fade-in">
      {/* Hero Section */}
      <section className="hero" style={{
        padding: '8rem 0 10rem',
        background: '#ffffff',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.06em', lineHeight: 1 }}>
            Compare the <span style={{ color: '#5b8c71' }}>cost of living</span> <br /> between any two cities
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '4rem', maxWidth: '650px', margin: '0 auto 4rem', fontWeight: 500 }}>
            Explore rent, food, transport, safety, and more. Plan your next global move or trip with reliable data.
          </p>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container section">
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span style={{ color: '#5b8c71', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Global Hubs</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>Premier Destinations</h2>
        </div>
        <div className="grid grid-cols-4">
          {featuredCities?.map(city => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      {/* Value Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
            <span style={{ color: '#5b8c71', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Budget Optimization</span>
            <h2 style={{ marginTop: '0.5rem', fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>Global Lifestyle Value</h2>
          </div>
          <div className="grid grid-cols-4">
            {cheapestCities?.map(city => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="container section">
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <span style={{ color: '#5b8c71', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Digital Infrastructure</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>Connectivity Leaders</h2>
        </div>
        <div className="grid grid-cols-4">
          {topNomadCities?.map(city => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>
    </div>
  );
}

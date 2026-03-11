import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch featured data for the homepage
  const { data: featuredCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('cost_index', { ascending: false })
    .limit(4);

  const { data: cheapestCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('rent_index', { ascending: true })
    .limit(4);

  const { data: topNomadCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('internet', { ascending: false })
    .limit(4);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero" style={{
        padding: '8rem 0',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container animate-fade-in">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Find the perfect city for your <span style={{ color: 'var(--secondary)' }}>next chapter</span>.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
            Compare cost of living, quality of life, and travel experiences across 45,000+ cities worldwide.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Categories / Quick Links */}
      <section className="container section">
        <div className="grid grid-cols-4">
          <Link href="/rankings/nomads" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💻</div>
            <h3 style={{ fontSize: '1.1rem' }}>Digital Nomad Hubs</h3>
          </Link>
          <Link href="/rankings/cheapest" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.1rem' }}>Budget Friendly</h3>
          </Link>
          <Link href="/rankings/safest" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.1rem' }}>Safest Cities</h3>
          </<ctrl94>
            <Link href="/compare" className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚖️</div>
              <h3 style={{ fontSize: '1.1rem' }}>Compare Cities</h3>
            </Link>
        </div>
      </section>

      {/* Featured Cities */}
      <section className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Top Quality of Life</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>The highest rated cities for standard of living.</p>
          </div>
          <Link href="/rankings/quality" style={{ color: 'var(--secondary)', fontWeight: 600 }}>View all →</Link>
        </div>
        <div className="grid grid-cols-4">
          {featuredCities?.map(city => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      {/* Cheapest Cities */}
      <section className="container section" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Best for Budgets</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Where your money goes the furthest.</p>
          </div>
          <Link href="/rankings/cheapest" style={{ color: 'var(--secondary)', fontWeight: 600 }}>View all →</Link>
        </div>
        <div className="grid grid-cols-4">
          {cheapestCities?.map(city => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      {/* Nomad Picks */}
      <section className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Digital Nomad Favorites</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Fast internet and vibrant work environments.</p>
          </div>
          <Link href="/rankings/nomads" style={{ color: 'var(--secondary)', fontWeight: 600 }}>View all →</Link>
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

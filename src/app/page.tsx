import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch featured data for the homepage
  const { data: featuredCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('cost_index', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  const { data: cheapestCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('rent_index', { ascending: true })
    .limit(4) as unknown as { data: City[] };

  const { data: topNomadCities } = await supabase
    .from('cities_master')
    .select('*')
    .order('internet', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero" style={{
        padding: '10rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.05em' }}>
            Your <span style={{ color: 'var(--secondary)' }}>Next Chapter</span> <br /> Starts Here.
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '3.5rem', maxWidth: '750px', margin: '0 auto 3.5rem', fontWeight: 500 }}>
            Compare costs, quality of life, and travel metrics across <span style={{ color: 'var(--secondary)' }}>45,000+ cities</span> worldwide. Clear, data-driven, and beautiful.
          </p>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories / Quick Links */}
      <section className="container section" style={{ marginTop: '-4rem', position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-4">
          <Link href="/rankings/nomads" className="card glass" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Digital Nomads</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Fast internet & workspaces</p>
          </Link>
          <Link href="/rankings/cheapest" className="card glass" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Budget Friendly</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Most affordable living</p>
          </Link>
          <Link href="/rankings/safest" className="card glass" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Safest Cities</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Secure & peaceful stays</p>
          </Link>
          <Link href="/compare" className="card glass" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Compare Now</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Detailed 1-on-1 metrics</p>
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

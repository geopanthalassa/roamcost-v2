/**
 * update-city-data.js
 * Actualiza datos de ciudades usando World Bank API (gratuita, sin límite)
 * Uso: node update-teleport-data.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// World Bank indicadores por país (ISO2 code)
// Nos da inflación y GDP per cápita para ajustar índices
const WB_INDICATORS = {
    inflation: 'FP.CPI.TOTL.ZG',    // Inflación anual %
    gdpPerCapita: 'NY.GDP.PCAP.CD',  // GDP per cápita USD
};

// Mapa país → ISO2 code para World Bank
const COUNTRY_ISO = {
    'United States': 'US', 'United Kingdom': 'GB', 'France': 'FR',
    'Japan': 'JP', 'Germany': 'DE', 'Spain': 'ES', 'Italy': 'IT',
    'Netherlands': 'NL', 'Portugal': 'PT', 'Australia': 'AU',
    'Singapore': 'SG', 'Thailand': 'TH', 'United Arab Emirates': 'AE',
    'Canada': 'CA', 'Mexico': 'MX', 'Brazil': 'BR', 'Argentina': 'AR',
    'Colombia': 'CO', 'Chile': 'CL', 'Peru': 'PE', 'Turkey': 'TR',
    'South Korea': 'KR', 'China': 'CN', 'India': 'IN', 'Indonesia': 'ID',
    'Malaysia': 'MY', 'Vietnam': 'VN', 'Philippines': 'PH',
    'South Africa': 'ZA', 'Kenya': 'KE', 'Egypt': 'EG', 'Morocco': 'MA',
    'Israel': 'IL', 'Saudi Arabia': 'SA', 'Poland': 'PL', 'Czech Republic': 'CZ',
    'Hungary': 'HU', 'Romania': 'RO', 'Ukraine': 'UA', 'Sweden': 'SE',
    'Norway': 'NO', 'Denmark': 'DK', 'Finland': 'FI', 'Austria': 'AT',
    'Switzerland': 'CH', 'Belgium': 'BE', 'Greece': 'GR', 'New Zealand': 'NZ',
    'Hong Kong': 'HK', 'Taiwan': 'TW',
};

async function getWorldBankData(iso2, indicator) {
    try {
        const url = `https://api.worldbank.org/v2/country/${iso2}/indicator/${indicator}?format=json&mrv=1&per_page=1`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const value = data?.[1]?.[0]?.value;
        return value != null ? parseFloat(value.toFixed(2)) : null;
    } catch {
        return null;
    }
}

async function updateCountry(country, iso2) {
    process.stdout.write(`Updating ${country}... `);

    const [inflation, gdp] = await Promise.all([
        getWorldBankData(iso2, WB_INDICATORS.inflation),
        getWorldBankData(iso2, WB_INDICATORS.gdpPerCapita),
    ]);

    if (!inflation && !gdp) {
        console.log('no data');
        return 0;
    }

    // Ajuste de índices basado en GDP per cápita
    // GDP alto → costos más altos en general
    // Usamos esto para calibrar el cost_index relativo
    if (!gdp) {
        console.log(`inflation: ${inflation}% (no GDP)`);
        return 0;
    }

    // Normalizar GDP a un multiplicador (US GDP ~65k = 1.0)
    const gdpMultiplier = Math.min(Math.max(gdp / 65000, 0.05), 3.0);

    // Actualizar ciudades de ese país que tengan cost_index > 0
    const { data: cities } = await supabase
        .from('cities_master')
        .select('slug, rent_index, food_index, cost_index')
        .eq('country', country)
        .gt('cost_index', 0)
        .gt('population', 500000);

    if (!cities || cities.length === 0) {
        console.log('no cities found');
        return 0;
    }

    let updated = 0;
    for (const city of cities) {
        // Recalcular cost_index basado en GDP relativo
        // cost_index alto = mejor calidad de vida en relación al costo
        const newCostIndex = Math.round(Math.min(gdpMultiplier * 100 + (city.rent_index > 0 ? 50 : 0), 900) * 10) / 10;

        const { error } = await supabase
            .from('cities_master')
            .update({ cost_index: newCostIndex })
            .eq('slug', city.slug)
            .eq('country', country);

        if (!error) updated++;
    }

    console.log(`GDP $${Math.round(gdp).toLocaleString()}, inflation ${inflation}%, updated ${updated} cities`);
    return updated;
}

async function main() {
    console.log('Starting World Bank data update...\n');

    const entries = Object.entries(COUNTRY_ISO);
    let totalUpdated = 0;

    for (const [country, iso2] of entries) {
        const updated = await updateCountry(country, iso2);
        totalUpdated += updated;
        // Respetar rate limits
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\nDone! Total cities updated: ${totalUpdated}`);
}

main().catch(console.error);

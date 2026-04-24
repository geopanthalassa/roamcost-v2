// Script: ciudades sin foto curada ordenadas por población
// Ejecutar: node scripts/cities-missing-photos.js

const fs   = require('fs');
const path = require('path');

// ── Leer credenciales ─────────────────────────────────────────────────────
const envFile = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envFile)) {
    console.error('No se encontró .env.local');
    process.exit(1);
}
fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
});

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── Slugs con foto curada (cityImages.ts + public/cities/) ────────────────
const cityImagesTs = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'lib', 'cityImages.ts'), 'utf8'
);
const CURATED = new Set(
    [...cityImagesTs.matchAll(/'([a-z0-9][a-z0-9-]+)':\s*['"`\/h]/g)].map(m => m[1])
);

// También los archivos locales en public/cities/
const citiesDir = path.join(__dirname, '..', 'public', 'cities');
if (fs.existsSync(citiesDir)) {
    fs.readdirSync(citiesDir).forEach(f => {
        if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')) {
            CURATED.add(f.replace(/\.(jpg|png|webp)$/, ''));
        }
    });
}

console.log(`✓ Fotos curadas: ${CURATED.size}`);

// ── Ciudades prioritarias (rankings) ──────────────────────────────────────
const POPULAR = new Set([
    'london','paris','berlin','madrid','barcelona','rome','amsterdam','vienna','prague',
    'lisbon','budapest','warsaw','stockholm','oslo','copenhagen','athens','dublin',
    'zurich','geneva','brussels','munich','hamburg','milan','florence','venice',
    'tokyo','seoul','bangkok','singapore','hong-kong','kuala-lumpur','jakarta','bali',
    'taipei','ho-chi-minh-city','hanoi','manila','osaka','beijing','shanghai',
    'dubai','abu-dhabi','tel-aviv','istanbul','riyadh','doha','beirut','amman',
    'new-york','los-angeles','chicago','miami','san-francisco','toronto','vancouver',
    'mexico-city','bogota','buenos-aires','sao-paulo','rio-de-janeiro','lima','santiago',
    'sydney','melbourne','auckland','cape-town','cairo','nairobi','casablanca',
    'montreal','seattle','boston','denver','atlanta','dallas',
    'medellin','montevideo','quito','panama-city','san-jose',
    'delhi','mumbai','bangalore','kathmandu','colombo',
    'moscow','kyiv','sofia','bucharest','belgrade','zagreb',
    'edinburgh','porto','seville','valencia','krakow','tallinn','riga','vilnius',
]);

// ── Traer ciudades de Supabase ────────────────────────────────────────────
async function fetchAll() {
    let all = [], offset = 0;
    process.stdout.write('Descargando ciudades de Supabase');
    while (true) {
        const res = await fetch(
            `${URL}/rest/v1/cities_master` +
            `?select=slug,city,country,population,cost_index` +
            `&population=gt.100000&cost_index=gt.0` +
            `&order=population.desc&limit=1000&offset=${offset}`,
            { headers: { apikey: KEY } }
        );
        if (!res.ok) { console.error(`\nError Supabase: ${res.status}`); process.exit(1); }
        const rows = await res.json();
        if (!Array.isArray(rows) || !rows.length) break;
        all = all.concat(rows);
        process.stdout.write('.');
        if (rows.length < 1000) break;
        offset += 1000;
    }
    console.log(` ${all.length} ciudades\n`);
    return all;
}

async function main() {
    const cities  = await fetchAll();
    const missing = cities.filter(c => !CURATED.has(c.slug));

    missing.sort((a, b) => {
        const ap = POPULAR.has(a.slug) ? 3 : 0;
        const bp = POPULAR.has(b.slug) ? 3 : 0;
        if (ap !== bp) return bp - ap;
        return (b.population || 0) - (a.population || 0);
    });

    // ── Mostrar en consola ────────────────────────────────────────────────
    console.log(`=== CIUDADES SIN FOTO (${missing.length} total) ===\n`);
    console.log('PRIORIDAD    SLUG                           CIUDAD                    PAÍS               POBLACIÓN');
    console.log('─'.repeat(100));

    // Mostrar las primeras 60 en consola
    missing.slice(0, 60).forEach(c => {
        const prio = POPULAR.has(c.slug)    ? '★ RANKING'
                   : c.population > 5000000 ? '  5M+    '
                   : c.population > 2000000 ? '  2M+    '
                   : c.population > 1000000 ? '  1M+    '
                   : c.population > 500000  ? '  500k   '
                   : '  <500k  ';
        console.log(
            `${prio}  ${c.slug.padEnd(30)} ${c.city.padEnd(26)} ${c.country.padEnd(20)} ${(c.population||0).toLocaleString()}`
        );
    });

    if (missing.length > 60) {
        console.log(`\n  ... y ${missing.length - 60} más (ver CSV)`);
    }

    // ── Generar CSV completo ──────────────────────────────────────────────
    const csv = ['slug,city,country,population,priority'];
    missing.forEach(c => {
        const prio = POPULAR.has(c.slug)    ? 'RANKING'
                   : c.population > 5000000 ? '5M+'
                   : c.population > 2000000 ? '2M+'
                   : c.population > 1000000 ? '1M+'
                   : c.population > 500000  ? '500k'
                   : '<500k';
        csv.push(`${c.slug},"${c.city}","${c.country}",${c.population||0},${prio}`);
    });
    fs.writeFileSync(path.join(__dirname, 'cities-missing-photos.csv'), csv.join('\n'));

    console.log(`\n✓ scripts/cities-missing-photos.csv — ${missing.length} ciudades`);
    console.log(`\nINSTRUCCIONES:`);
    console.log(`  Carpeta: ROAMCOST/public/cities/`);
    console.log(`  Nombre:  [slug].jpg  (ej: denver.jpg, minsk.jpg)`);
    console.log(`  Specs:   1200x750px mínimo, JPG, skyline/vista aérea, sin personas`);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });

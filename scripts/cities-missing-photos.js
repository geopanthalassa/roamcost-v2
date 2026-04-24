// Script: ciudades sin foto curada, ordenadas por prioridad
// Ejecutar: node scripts/cities-missing-photos.js
// Genera:   scripts/cities-missing-photos.txt

const fs   = require('fs');
const path = require('path');

// ── 1. Leer credenciales de .env.local ───────────────────────────────────────
const envFile = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envFile)) {
    console.error('No se encontró .env.local en la raíz del proyecto');
    process.exit(1);
}
fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
});

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('Faltan vars de Supabase'); process.exit(1); }

// ── 2. Slugs que YA tienen foto curada ───────────────────────────────────────
// (generado leyendo cityImages.ts)
const cityImagesTs = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'lib', 'cityImages.ts'), 'utf8'
);
const CURATED = new Set(
    [...cityImagesTs.matchAll(/'([a-z0-9-]+)':\s*['"`]/g)].map(m => m[1])
);
console.log(`Fotos curadas en cityImages.ts: ${CURATED.size}`);

// ── 3. Ciudades prioritarias (rankings) ───────────────────────────────────────
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

// ── 4. Traer ciudades de Supabase (paginado) ──────────────────────────────────
async function fetchAll(minPop) {
    let all = [], offset = 0;
    while (true) {
        const res = await fetch(
            `${URL}/rest/v1/cities_master` +
            `?select=slug,city,country,population,cost_index` +
            `&population=gt.${minPop}&cost_index=gt.0` +
            `&order=population.desc&limit=1000&offset=${offset}`,
            { headers: { apikey: KEY } }
        );
        const rows = await res.json();
        if (!Array.isArray(rows) || !rows.length) break;
        all = all.concat(rows);
        if (rows.length < 1000) break;
        offset += 1000;
    }
    return all;
}

// ── 5. Main ───────────────────────────────────────────────────────────────────
async function main() {
    console.log('Consultando Supabase...');

    const cities = await fetchAll(50000);          // todas con > 50k hab y datos
    console.log(`Ciudades en Supabase con datos: ${cities.length}`);

    // Filtrar las que YA tienen foto
    const missing = cities.filter(c => !CURATED.has(c.slug));

    // Ordenar: rankings primero → luego por población
    missing.sort((a, b) => {
        const ap = POPULAR.has(a.slug) ? 2 : 0;
        const bp = POPULAR.has(b.slug) ? 2 : 0;
        if (ap !== bp) return bp - ap;
        return (b.population || 0) - (a.population || 0);
    });

    // ── 6. Generar salidas ────────────────────────────────────────────────────
    const lines = ['PRIORIDAD | SLUG | CIUDAD | PAÍS | POBLACIÓN'];
    lines.push('─'.repeat(80));

    for (const c of missing) {
        const prio = POPULAR.has(c.slug) ? '★ RANKING'
                   : c.population > 5000000 ? '  5M+'
                   : c.population > 2000000 ? '  2M+'
                   : c.population > 1000000 ? '  1M+'
                   : c.population > 500000  ? '  500k'
                   : '  <500k';
        const row = `${prio.padEnd(10)} | ${c.slug.padEnd(30)} | ${c.city.padEnd(22)} | ${c.country.padEnd(20)} | ${(c.population||0).toLocaleString()}`;
        lines.push(row);
    }

    lines.push('');
    lines.push(`Total sin foto: ${missing.length}`);
    lines.push('');
    lines.push('=== CÓMO AGREGAR FOTOS ===');
    lines.push('1. Crea la carpeta: ROAMCOST/public/cities/');
    lines.push('2. Guarda cada foto como: public/cities/[SLUG].jpg');
    lines.push('   Ej: public/cities/amman.jpg');
    lines.push('   Tamaño mínimo: 1200x750px · Formato JPG · Sin personas en primer plano');
    lines.push('   Solo 1 foto por ciudad — skyline, vista aérea o landmark icónico');
    lines.push('3. Decile al chat:');
    lines.push('   "Subí fotos en public/cities/ para: amman, seattle, etc.');
    lines.push('    Actualizá src/lib/cityImages.ts para mapearlas"');

    const outTxt = path.join(__dirname, 'cities-missing-photos.txt');
    fs.writeFileSync(outTxt, lines.join('\n'), 'utf8');

    // CSV para abrir en Excel
    const csv = ['slug,city,country,population,priority'];
    for (const c of missing) {
        const prio = POPULAR.has(c.slug) ? 'RANKING'
                   : c.population > 5000000 ? '5M+'
                   : c.population > 2000000 ? '2M+'
                   : c.population > 1000000 ? '1M+'
                   : '500k';
        csv.push(`${c.slug},"${c.city}","${c.country}",${c.population||0},${prio}`);
    }
    const outCsv = path.join(__dirname, 'cities-missing-photos.csv');
    fs.writeFileSync(outCsv, csv.join('\n'), 'utf8');

    console.log('\n' + lines.slice(0, 30).join('\n'));
    console.log(`\n✓ Guardado: scripts/cities-missing-photos.txt`);
    console.log(`✓ Guardado: scripts/cities-missing-photos.csv  (ábrelo en Excel)`);
    console.log(`\nTotal sin foto: ${missing.length}`);
}

main().catch(console.error);

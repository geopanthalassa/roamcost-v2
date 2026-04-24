// Ejecutar desde CUALQUIER carpeta:
//   node C:\ruta\al\proyecto\scripts\cities-missing-photos.js
// O desde la raiz del proyecto:
//   node scripts/cities-missing-photos.js

const fs   = require('fs');
const path = require('path');

// Busca .env.local subiendo carpetas desde donde está el script
function findEnvLocal(startDir) {
    let dir = startDir;
    for (let i = 0; i < 5; i++) {
        const candidate = path.join(dir, '.env.local');
        if (fs.existsSync(candidate)) return candidate;
        dir = path.dirname(dir);
    }
    return null;
}

const envFile = findEnvLocal(__dirname);
if (!envFile) {
    console.error('\n❌ No se encontró .env.local');
    console.error('   Asegurate de ejecutar desde la carpeta del proyecto:');
    console.error('   cd C:\\Users\\andre\\Desktop\\PROYECTOS_GRAVITY\\ROAMCOST');
    console.error('   node scripts/cities-missing-photos.js\n');
    process.exit(1);
}

console.log(`✓ Usando: ${envFile}`);
fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('\n❌ .env.local encontrado pero faltan las variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
    process.exit(1);
}

// Lee cityImages.ts para saber qué slugs ya tienen foto
const cityImagesPath = path.join(__dirname, '..', 'src', 'lib', 'cityImages.ts');
const cityImagesTs   = fs.readFileSync(cityImagesPath, 'utf8');
const CURATED = new Set(
    [...cityImagesTs.matchAll(/'([a-z0-9][a-z0-9-]*)':\s*['"`h]/g)].map(m => m[1])
);
console.log(`✓ Fotos curadas en cityImages.ts: ${CURATED.size}`);

// Slugs que aparecen en rankings (prioridad máxima)
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

async function fetchAll() {
    let all = [], offset = 0;
    process.stdout.write('  Descargando ciudades');
    while (true) {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/cities_master` +
            `?select=slug,city,country,population,cost_index` +
            `&population=gt.50000&cost_index=gt.0` +
            `&order=population.desc&limit=1000&offset=${offset}`,
            { headers: { apikey: SUPABASE_KEY } }
        );
        if (!res.ok) { console.error(`\n❌ Error Supabase: ${res.status}`); process.exit(1); }
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

    // ── Generar TXT ──────────────────────────────────────────────────────────
    const lines = [];
    lines.push('=== CIUDADES SIN FOTO CURADA ===');
    lines.push(`Total: ${missing.length} ciudades`);
    lines.push(`Curadas: ${CURATED.size} ciudades`);
    lines.push('');
    lines.push('PRIORIDAD  SLUG                           CIUDAD                PAÍS                  POBLACIÓN');
    lines.push('─'.repeat(100));

    for (const c of missing) {
        const prio = POPULAR.has(c.slug)    ? '★ RANKING'
                   : c.population > 5000000 ? '  5M+    '
                   : c.population > 2000000 ? '  2M+    '
                   : c.population > 1000000 ? '  1M+    '
                   : c.population > 500000  ? '  500k   '
                   : '  <500k  ';
        lines.push(
            `${prio}  ${c.slug.padEnd(30)} ${c.city.padEnd(20)} ${c.country.padEnd(20)} ${(c.population||0).toLocaleString()}`
        );
    }

    lines.push('');
    lines.push('=== CÓMO USAR ESTE ARCHIVO ===');
    lines.push('');
    lines.push('ESTRUCTURA DE CARPETAS:');
    lines.push('  ROAMCOST/');
    lines.push('    public/');
    lines.push('      cities/          ← CREAR esta carpeta');
    lines.push('        amman.jpg      ← nombre = slug exacto de la columna SLUG');
    lines.push('        seattle.jpg');
    lines.push('        kyiv.jpg');
    lines.push('');
    lines.push('SPECS DE CADA FOTO:');
    lines.push('  • 1 foto por ciudad');
    lines.push('  • Nombre: [slug].jpg  (ej: buenos-aires.jpg)');
    lines.push('  • Tamaño mínimo: 1200 x 750 px');
    lines.push('  • Formato: JPG, calidad 80-90%');
    lines.push('  • Contenido: skyline, vista aérea o landmark — SIN personas en primer plano');
    lines.push('');
    lines.push('CUANDO TENGAS LAS FOTOS, decile al chat:');
    lines.push('  "Subí estas fotos a public/cities/: amman, seattle, kyiv');
    lines.push('   Actualizá src/lib/cityImages.ts para mapearlas"');

    const outTxt = path.join(__dirname, 'cities-missing-photos.txt');
    fs.writeFileSync(outTxt, lines.join('\n'), 'utf8');

    // ── Generar CSV ──────────────────────────────────────────────────────────
    const csv = ['slug,city,country,population,priority'];
    for (const c of missing) {
        const prio = POPULAR.has(c.slug)    ? 'RANKING'
                   : c.population > 5000000 ? '5M+'
                   : c.population > 2000000 ? '2M+'
                   : c.population > 1000000 ? '1M+'
                   : c.population > 500000  ? '500k'
                   : '<500k';
        csv.push(`${c.slug},"${c.city}","${c.country}",${c.population||0},${prio}`);
    }
    const outCsv = path.join(__dirname, 'cities-missing-photos.csv');
    fs.writeFileSync(outCsv, csv.join('\n'), 'utf8');

    // ── Preview en consola ───────────────────────────────────────────────────
    console.log('PRIORIDAD  SLUG                           CIUDAD                PAÍS');
    console.log('─'.repeat(85));
    missing.slice(0, 40).forEach(c => {
        const prio = POPULAR.has(c.slug) ? '★ RANKING' : `  ${(c.population/1000000).toFixed(1)}M  `;
        console.log(`${prio}  ${c.slug.padEnd(30)} ${c.city.padEnd(20)} ${c.country}`);
    });
    if (missing.length > 40) console.log(`  ... y ${missing.length - 40} más`);

    console.log(`\n✓ scripts/cities-missing-photos.txt`);
    console.log(`✓ scripts/cities-missing-photos.csv  (abrí en Excel)`);
    console.log(`\nTotal sin foto: ${missing.length} ciudades`);
    console.log(`En rankings sin foto: ${missing.filter(c => POPULAR.has(c.slug)).length} ciudades`);
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });

// Script que lista ciudades sin foto curada, ordenadas por prioridad
// Ejecutar: node scripts/cities-missing-photos.js
// Genera: scripts/cities-missing-photos.txt

const fs = require('fs');
const path = require('path');

// Leer .env.local
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ciudades que YA tienen foto curada en cityImages.ts
const CURATED = new Set([
    'london','paris','berlin','madrid','barcelona','rome','amsterdam','vienna','prague',
    'lisbon','budapest','warsaw','stockholm','oslo','copenhagen','athens','dublin',
    'zurich','geneva','brussels','munich','hamburg','milan','florence','venice',
    'tokyo','seoul','bangkok','singapore','hong-kong','kuala-lumpur','jakarta','bali',
    'taipei','ho-chi-minh-city','hanoi','manila','osaka','beijing','shanghai',
    'dubai','abu-dhabi','tel-aviv','istanbul','riyadh','doha','beirut',
    'new-york','los-angeles','chicago','miami','toronto','vancouver',
    'mexico-city','bogota','buenos-aires','sao-paulo','rio-de-janeiro','lima','santiago',
    'sydney','melbourne','auckland','cape-town','cairo','nairobi','casablanca',
    'medellin','montevideo','quito','panama-city',
    'delhi','mumbai','bangalore','kathmandu','colombo',
    'moscow','sofia','bucharest','belgrade','zagreb',
    'edinburgh','porto','seville','krakow','tallinn','riga','vilnius',
    'abuja','kinshasa','luanda','brazzaville','bamako','abidjan','accra',
    'addis-ababa','dakar','kampala','lagos','dar-es-salaam','khartoum',
    'abu-dhabi','amman','muscat','kuwait-city','tehran','baghdad',
    'algiers','tunis','johannesburg','cape-town',
    'guangzhou','busan','daegu','almaty','tashkent','baku',
    'dhaka','karachi','lahore','colombo','yangon',
    'havana','managua','tegucigalpa','caracas','cali','asuncion','la-paz',
    'san-jose-costa-rica','panama-city',
    'sofia','zagreb','belgrade','kyiv','minsk','tallinn','vilnius','riga',
    'frankfurt','lyon','marseille','seville','valencia','porto','edinburgh','birmingham',
    'budapest','krakow','bucharest',
    'perth','brisbane','auckland',
    'las-vegas','phoenix','san-diego','houston','dallas','atlanta','boston','seattle','denver',
    'san-francisco','montreal',
]);

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

async function fetchCities(minPop, limit = 200) {
    let all = [];
    let offset = 0;
    while (true) {
        const res = await fetch(
            `${URL}/rest/v1/cities_master?select=slug,city,country,population,cost_index` +
            `&population=gt.${minPop}&cost_index=gt.0&order=population.desc&limit=100&offset=${offset}`,
            { headers: { 'apikey': KEY } }
        );
        const data = await res.json();
        if (!data.length) break;
        all = all.concat(data);
        offset += 100;
        if (all.length >= limit) break;
    }
    return all;
}

async function main() {
    console.log('Consultando Supabase...\n');

    const cities500k = await fetchCities(500000, 500);

    // Filter out cities that already have photos
    const missing = cities500k.filter(c => !CURATED.has(c.slug));

    // Sort: popular first, then by population
    missing.sort((a, b) => {
        const aP = POPULAR.has(a.slug) ? 1 : 0;
        const bP = POPULAR.has(b.slug) ? 1 : 0;
        if (aP !== bP) return bP - aP;
        return (b.population || 0) - (a.population || 0);
    });

    console.log(`=== Ciudades sin foto curada (población > 500k) ===`);
    console.log(`Total encontradas: ${missing.length}\n`);

    const lines = ['slug,city,country,population,priority'];
    
    let i = 1;
    for (const c of missing) {
        const priority = POPULAR.has(c.slug) ? 'RANKING' : 
                        (c.population > 2000000 ? 'ALTA' : 
                        (c.population > 1000000 ? 'MEDIA' : 'BAJA'));
        console.log(`${String(i).padStart(3)}. [${priority.padEnd(7)}] ${c.city.padEnd(20)} ${c.country.padEnd(20)} ${(c.population||0).toLocaleString()}`);
        lines.push(`${c.slug},${c.city},${c.country},${c.population},${priority}`);
        i++;
    }

    const outPath = path.join(__dirname, 'cities-missing-photos.csv');
    fs.writeFileSync(outPath, lines.join('\n'));
    console.log(`\nArchivo guardado: scripts/cities-missing-photos.csv`);
    console.log(`\n=== INSTRUCCIONES PARA AGREGAR FOTOS ===`);
    console.log(`1. Crea la carpeta: public/cities/`);
    console.log(`2. Guarda cada foto como: public/cities/[slug].jpg`);
    console.log(`   Ejemplo: public/cities/amman.jpg`);
    console.log(`   Tamaño recomendado: 1200x750px mínimo, JPG 85% calidad`);
    console.log(`   Solo 1 foto por ciudad`);
    console.log(`3. En el próximo chat decí:`);
    console.log(`   "Subí fotos en public/cities/ para estas ciudades: amman, seattle, etc.`);
    console.log(`    Actualiza src/lib/cityImages.ts para mapearlas"`);
}

main().catch(console.error);

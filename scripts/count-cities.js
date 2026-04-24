// Script para contar ciudades en Supabase
// Ejecutar desde la raiz del proyecto:
//   node scripts/count-cities.js

const fs = require('fs');
const path = require('path');

// Leer .env.local automáticamente
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
    console.error('Error: no se encontró .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

async function count(filter = '') {
    const res = await fetch(`${URL}/rest/v1/cities_master?select=count${filter}`, {
        headers: { 'apikey': KEY, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }
    });
    return parseInt((res.headers.get('content-range') || '*/0').split('/')[1] || '0');
}

async function main() {
    console.log('\n=== RoamCost — Ciudades en Supabase ===\n');
    const total     = await count();
    const conDatos  = await count('&cost_index=gt.0');
    const conRenta  = await count('&rent_index=gt.0');
    const conSafety = await count('&safety=gt.0');
    const conNet    = await count('&internet=gt.0');
    const conPob    = await count('&population=gt.1000000');
    const completas = await count('&cost_index=gt.0&rent_index=gt.0&safety=gt.0&internet=gt.0');

    console.log(`Total ciudades:          ${total.toLocaleString()}`);
    console.log(`Con cost_index > 0:      ${conDatos.toLocaleString()}`);
    console.log(`Con rent_index > 0:      ${conRenta.toLocaleString()}`);
    console.log(`Con safety > 0:          ${conSafety.toLocaleString()}`);
    console.log(`Con internet > 0:        ${conNet.toLocaleString()}`);
    console.log(`Población > 1M:          ${conPob.toLocaleString()}`);
    console.log(`Datos completos (todos): ${completas.toLocaleString()}`);
    console.log(`\nFotos curadas:           315 ciudades`);
    console.log(`En rankings:             ~90 ciudades populares\n`);
}

main().catch(console.error);

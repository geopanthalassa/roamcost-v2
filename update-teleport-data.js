/**
 * update-teleport-data.js
 * 
 * Script para actualizar datos de ciudades en Supabase usando Teleport API (gratuita).
 * Cubre ~260 ciudades principales con scores actualizados.
 * 
 * Uso: node update-teleport-data.js
 * Recomendado: correr mensualmente via cron job
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mapeo de slugs de Teleport a slugs de RoamCost
// Teleport usa nombres como "new-york" y nosotros también, pero algunos difieren
const TELEPORT_SLUG_MAP = {
    'new-york': 'new-york',
    'london': 'london',
    'paris': 'paris',
    'tokyo': 'tokyo',
    'berlin': 'berlin',
    'amsterdam': 'amsterdam',
    'barcelona': 'barcelona',
    'madrid': 'madrid',
    'rome': 'rome',
    'vienna': 'vienna',
    'zurich': 'zurich',
    'stockholm': 'stockholm',
    'oslo': 'oslo',
    'copenhagen': 'copenhagen',
    'singapore': 'singapore',
    'hong-kong': 'hong-kong',
    'seoul': 'seoul',
    'taipei': 'taipei',
    'bangkok': 'bangkok',
    'kuala-lumpur': 'kuala-lumpur',
    'sydney': 'sydney',
    'melbourne': 'melbourne',
    'dubai': 'dubai',
    'tel-aviv': 'tel-aviv',
    'toronto': 'toronto',
    'vancouver': 'vancouver',
    'san-francisco': 'san-francisco',
    'los-angeles': 'los-angeles',
    'chicago': 'chicago',
    'miami': 'miami',
    'mexico-city': 'mexico-city',
    'buenos-aires': 'buenos-aires',
    'sao-paulo': 'sao-paulo',
    'bogota': 'bogota',
    'lima': 'lima',
    'santiago-de-chile': 'santiago-chile',
    'lisbon': 'lisbon',
    'prague': 'prague',
    'budapest': 'budapest',
    'warsaw': 'warsaw',
    'brussels': 'brussels',
    'helsinki': 'helsinki',
    'cape-town': 'cape-town',
    'nairobi': 'nairobi',
    'cairo': 'cairo',
    'mumbai': 'mumbai',
    'bangalore': 'bangalore',
    'jakarta': 'jakarta',
    'manila': 'manila',
    'ho-chi-minh-city': 'ho-chi-minh-city',
};

async function getTeleportScores(teleportSlug) {
    try {
        const res = await fetch(
            `https://api.teleport.org/api/urban_areas/slug:${teleportSlug}/scores/`
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.categories;
    } catch {
        return null;
    }
}

async function getTeleportDetails(teleportSlug) {
    try {
        const res = await fetch(
            `https://api.teleport.org/api/urban_areas/slug:${teleportSlug}/details/`
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

function mapTeleportToCity(categories, details) {
    if (!categories) return null;

    const get = (name) => categories.find(c => c.name === name)?.score_out_of_10 ?? null;

    // Map Teleport categories to our columns
    const updates = {};

    const safety = get('Safety');
    if (safety) updates.safety = parseFloat(safety.toFixed(2));

    const healthcare = get('Healthcare');
    if (healthcare) updates.healthcare = parseFloat(healthcare.toFixed(2));

    const environment = get('Environmental Quality');
    if (environment) updates.environment = parseFloat(environment.toFixed(2));

    const leisure = get('Leisure & Culture');
    if (leisure) updates.leisure = parseFloat(leisure.toFixed(2));

    const outdoors = get('Outdoors');
    if (outdoors) updates.outdoors = parseFloat(outdoors.toFixed(2));

    const internet = get('Internet Access');
    if (internet) {
        // Convert score/10 to Mbps approximation
        updates.internet = parseFloat((internet * 15).toFixed(2));
    }

    // Extract cost data from details if available
    if (details?.categories) {
        const costCat = details.categories.find(c => c.id === 'COST-OF-LIVING');
        if (costCat?.data) {
            const rent = costCat.data.find(d => d.id === 'COST-APRT-1BR');
            if (rent?.float_value) updates.rent_index = parseFloat(rent.float_value.toFixed(2));

            const food = costCat.data.find(d => d.id === 'COST-RESTAURANT-CHEAP');
            if (food?.float_value) updates.food_index = parseFloat(food.float_value.toFixed(2));
        }
    }

    return Object.keys(updates).length > 0 ? updates : null;
}

async function updateCity(teleportSlug, roamcostSlug) {
    console.log(`Updating ${roamcostSlug}...`);

    const [categories, details] = await Promise.all([
        getTeleportScores(teleportSlug),
        getTeleportDetails(teleportSlug),
    ]);

    const updates = mapTeleportToCity(categories, details);
    if (!updates) {
        console.log(`  No data for ${teleportSlug}`);
        return false;
    }

    const { error } = await supabase
        .from('cities_master')
        .update(updates)
        .eq('slug', roamcostSlug)
        .gt('population', 100000); // solo actualiza la ciudad principal

    if (error) {
        console.error(`  Error updating ${roamcostSlug}:`, error.message);
        return false;
    }

    console.log(`  Updated: ${Object.keys(updates).join(', ')}`);
    return true;
}

async function main() {
    console.log('Starting Teleport data update...\n');

    const entries = Object.entries(TELEPORT_SLUG_MAP);
    let updated = 0;
    let failed = 0;

    for (const [teleportSlug, roamcostSlug] of entries) {
        const success = await updateCity(teleportSlug, roamcostSlug);
        if (success) updated++;
        else failed++;

        // Rate limiting — 1 req/second para ser respetuoso con la API
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

main().catch(console.error);

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectDatabase() {
    const { data, error } = await supabase
        .from('cities_master')
        .select('count', { count: 'exact', head: true });

    console.log('cities_master count:', data, error);

    // Try to list schemas if possible or just try common names
    const commonTables = ['cities', 'cities_master', 'cities_data', 'locations'];
    for (const table of commonTables) {
        const { data: tData, error: tError } = await supabase.from(table).select('*').limit(1);
        if (!tError) {
            console.log(`Found table ${table} with sample:`, tData);
        } else {
            console.log(`Table ${table} error:`, tError.message);
        }
    }
}

inspectDatabase();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectColumns() {
    // PostgREST doesn't easily expose column info, but we can try to get one row
    // with a select * and see the keys
    const { data, error } = await supabase.from('cities_master').select('*').limit(1);
    if (error) {
        // If it's an empty table error, it might not return columns.
        // We can also try an insert with dummy data and see the error message for hints.
        console.log('Select failed or returned empty:', error);
    } else {
        console.log('Columns in cities_master:', data.length > 0 ? Object.keys(data[0]) : 'No data');
    }

    // Alternative: try to insert a record with just 'city' and see what happens
    const { error: insError } = await supabase.from('cities_master').insert([{ city: 'Test' }]);
    console.log('Insert test error (might hint at missing columns):', insError?.message);
}

inspectColumns();

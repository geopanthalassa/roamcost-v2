const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const results = [];

fs.createReadStream('cities_master_rows.csv')
    .pipe(csv())
    .on('data', (data) => {
        // Clean up empty strings to null or default values
        const cleanData = {
            city: data.city,
            country: data.country,
            lat: data.lat ? parseFloat(data.lat) : null,
            long: data.long ? parseFloat(data.long) : null,
            population: data.population ? parseInt(data.population) : null,
            rent_index: data.rent_index ? parseFloat(data.rent_index) : 0,
            food_index: data.food_index ? parseFloat(data.food_index) : 0,
            transport_index: data.transport_index ? parseFloat(data.transport_index) : 0,
            utilities_index: data.utilities_index ? parseFloat(data.utilities_index) : 0,
            entertainment_index: data.entertainment_index ? parseFloat(data.entertainment_index) : 0,
            cost_index: data.cost_index ? parseFloat(data.cost_index) : 0,
            safety: data.safety ? parseFloat(data.safety) : 50,
            healthcare: data.healthcare ? parseFloat(data.healthcare) : 50,
            internet: data.internet ? parseFloat(data.internet) : 50,
            leisure: data.leisure ? parseFloat(data.leisure) : 50,
            outdoors: data.outdoors ? parseFloat(data.outdoors) : 50,
            environment: data.environment ? parseFloat(data.environment) : 50,
            commute: data.commute ? parseFloat(data.commute) : 50,
            slug: data.slug || data.city.toLowerCase().replace(/ /g, '-')
        };
        results.push(cleanData);
    })
    .on('end', async () => {
        console.log(`Parsed ${results.length} rows. Starting upload...`);

        // Upload in batches of 50
        const batchSize = 50;
        console.log(`Starting upload in batches of ${batchSize}...`);
        for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);

            let retryCount = 0;
            let success = false;

            while (retryCount < 5 && !success) {
                try {
                    const { error } = await supabase
                        .from('cities_master')
                        .insert(batch);

                    if (error) {
                        console.error(`Error uploading batch ${i / batchSize} (Attempt ${retryCount + 1}):`, error.message);
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
                    } else {
                        if ((i / batchSize + 1) % 10 === 0 || i + batchSize >= results.length) {
                            console.log(`Uploaded batch ${i / batchSize + 1}/${Math.ceil(results.length / batchSize)} (${i + batch.length} rows total)`);
                        }
                        success = true;
                    }
                } catch (e) {
                    console.error(`Fetch/Network error on batch ${i / batchSize} (Attempt ${retryCount + 1}):`, e.message);
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            if (!success) {
                console.error(`FAILED to upload batch starting at index ${i} after 5 attempts. Skipping...`);
            }

            // Minimal delay between successful batches
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('Upload complete.');
    });

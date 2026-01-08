const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function verify() {
    try {
        // 1. Read .env file directly
        const envPath = path.join(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env file not found!');
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim(); // Handle values with = in them if any (though base64 usually safe)
                if (key && value) env[key] = value;
            }
        });

        const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY not found in .env');
            console.log('Keys found:', Object.keys(env));
            process.exit(1);
        }

        console.log(`Connecting to Supabase at ${supabaseUrl}...`);
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Test get_dashboard_stats
        console.log('\nTesting RPC: get_dashboard_stats...');
        // We use a nil UUID. It should return success with empty/zero data, NOT an error.
        const { data, error } = await supabase.rpc('get_dashboard_stats', {
            target_store_id: '00000000-0000-0000-0000-000000000000'
        });

        if (error) {
            if (error.code === '42883' || error.message?.includes('function') && error.message?.includes('does not exist')) {
                console.error('❌ FAILED: Function "get_dashboard_stats" NOT FOUND.');
                console.error('   Please make sure you ran "supabase_dashboard_stats.sql" in the SQL Editor.');
            } else {
                console.error('⚠️ WARN: Function found but returned error (expected with fake UUID?):', error.message);
                // If it's a permission error or logic error, the function likely exists at least.
                console.log('   (This generally means the function EXISTS but failed to execute, which is better than Not Found)');
            }
        } else {
            console.log('✅ SUCCESS: "get_dashboard_stats" is installed and callable.');
        }

        // 3. Test create_organization_and_link_user existence
        // We can't easily call this without side effects, but we can try to call it with invalid arguments 
        // to see if it throws "schema validation" (function exists) vs "does not exist".
        console.log('\nTesting RPC: create_organization_and_link_user...');
        const { error: orgError } = await supabase.rpc('create_organization_and_link_user', {
            org_name: null, // Invalid
            business_type: null,
            phone: null,
            address: null
        });

        if (orgError) {
            if (orgError.code === '42883' || orgError.message?.includes('does not exist')) {
                console.error('❌ FAILED: Function "create_organization_and_link_user" NOT FOUND.');
                console.error('   Please run "supabase_rpc_migration.sql" in the SQL Editor.');
            } else {
                // Any other error (like "null value in column") means the function IS there and trying to work.
                console.log('✅ SUCCESS: "create_organization_and_link_user" appears to exist (returned logic error as expected).');
            }
        } else {
            console.log('✅ SUCCESS: "create_organization_and_link_user" exists.');
        }

    } catch (err) {
        console.error('Script Error:', err);
    }
}

verify();

import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log('[Supabase] Initializing with URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING!');

const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };

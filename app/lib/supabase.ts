import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://wmjnmzlnmcppmacajige.supabase.co';
const supabaseKey = 'sb_publishable_fdW3p3E3_RsFdmxtwK-wwA_0j08Ez3g';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
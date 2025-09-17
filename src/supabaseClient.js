import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jqflbshrgfekvyroptnk.supabase.co';
const supabaseKey = 'sb_publishable_oAV2OvSUdZ7uBBsjfpsMGQ_5A4rit37';

export const supabase = createClient(supabaseUrl, supabaseKey);
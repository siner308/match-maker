import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';

class RoundRepo {
	constructor(private readonly supabase: SupabaseClient) {}
}

export const roundRepo = new RoundRepo(supabase);

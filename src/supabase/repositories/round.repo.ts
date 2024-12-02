import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';

class RoundRepository {
	constructor(private readonly supabase: SupabaseClient) {}
}

export const roundRepo = new RoundRepository(supabase);

import { supabase } from '../client';
import type { Match } from '../entieies/match.entity';
import type { SupabaseClient } from '@supabase/supabase-js';

class MatchRepo {
	constructor(private readonly supabase: SupabaseClient) {}

	async save(match: Match) {
		return supabase.from('matches').upsert(match);
	}
}

export const matchRepo = new MatchRepo(supabase);

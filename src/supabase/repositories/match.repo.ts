import { supabase } from '../client';
import { Match } from '../entieies/match.entity';
import type { SupabaseClient } from '@supabase/supabase-js';

class MatchRepository {
	constructor(private readonly supabase: SupabaseClient) {}

	async save(match: Match) {
		return supabase.from('matches').upsert(match.dbValues);
	}

	async findByMatchIdWithPlayers(id: string): Promise<Match> {
		const { data, error } = await this.supabase
			.from('matches')
			.select(
				`
		*,
		player1:player1_id (
			*
		),
		player2:player2_id (
			*
		)
		`
			)
			.eq('id', id)
			.single();
		if (error) throw error;
		return new Match(data);
	}
}

export const matchRepo = new MatchRepository(supabase);

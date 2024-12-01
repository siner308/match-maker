import type { Player } from '../entieies/player.entity';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';

class PlayerRepo {
	constructor(private readonly supabase: SupabaseClient) {}

	async save(player: Player): Promise<Player> {
		const { data, error } = await this.supabase.from('players').upsert(player).select();
		if (error) throw error;
		return data[0];
	}

	async findByName(name: string): Promise<Player | null> {
		const { data, error } = await this.supabase
			.from('players')
			.select('*')
			.eq('name', name)
			.maybeSingle();
		if (error) throw error;
		return data;
	}

	async findByRoomId(roomId: string): Promise<Player[]> {
		// get unique players from the room
		const { data, error } = await this.supabase
			.from('players')
			.select('*')
			.eq('room_id', roomId)
			.order('name');
		if (error) throw error;
		return data;
	}
}

export const playerRepo = new PlayerRepo(supabase);
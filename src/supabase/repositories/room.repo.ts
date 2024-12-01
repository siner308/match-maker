import type { Room } from '../entieies/room.entity';
import {
	type PostgrestMaybeSingleResponse,
	type PostgrestResponse,
	type PostgrestSingleResponse,
	SupabaseClient
} from '@supabase/supabase-js';
import { supabase } from '../client';
import { Round } from '../entieies/round.entity';
import type { Player } from '../entieies/player.entity';
import { Match } from '../entieies/match.entity';

class RoomRepo {
	constructor(private readonly supabase: SupabaseClient) {}

	async save(room: Room): Promise<Room> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { rounds, ...rest } = room;
		const { data, error } = await this.supabase.from('rooms').upsert(rest).select();
		if (error) throw error;
		return data[0];
	}

	async findByName(name: string): Promise<Room | null> {
		const { data, error } = await this.supabase
			.from('rooms')
			.select('*')
			.eq('name', name)
			.maybeSingle();
		if (error) throw error;
		return data;
	}

	async getDetailById(id: string): Promise<Room> {
		const { data, error }: PostgrestSingleResponse<Room> = await this.supabase
			.from('rooms')
			.select(
				`
			*,
			rounds (
				*,
				matches (
					*,
					player1:player1_id (
						*
					),
					player2:player2_id (
						*
					)
				)
			)
			`
			)
			.eq('id', id)
			.single();
		if (error) throw error;

		data.rounds.sort((a, b) => a.round_number - b.round_number);
		data.rounds.forEach((round) => {
			round.matches.sort((a, b) => {
				if (!a.finished_at && !b.finished_at) return 0;
				if (!a.finished_at) return 1;
				if (!b.finished_at) return -1;
				return a.finished_at.getTime() - b.finished_at.getTime();
			});
		});
		return data;
	}

	async startRound(roomId: string) {
		const room = await this.getDetailById(roomId);
		const isRecentRoundNotFinished =
			room.rounds.length && !room.rounds?.[room.rounds.length - 1]?.finished_at;
		if (isRecentRoundNotFinished) {
			throw new Error('Recent round is not finished');
		}
		const round = new Round(room);
		round.round_number = room.rounds.length + 1;
		debugger;

		const { data, error }: PostgrestSingleResponse<Round> = await this.supabase
			.from('rounds')
			.insert(round.dbValues)
			.single();
		if (error) throw error;
		debugger;

		// create matches
		const players: PostgrestResponse<Player> = await this.supabase
			.from('players')
			.select('*')
			.eq('room_id', roomId);
		if (players.error) {
			// rollback
			await this.supabase.from('rounds').delete().eq('id', data.id);
			throw players.error;
		}
		debugger;

		// swiss system pairing. match from last round score
		// new player is inserted at the end of the list
		// if player count is odd, the last player is not paired
		const lastRound = room.rounds.length ? room.rounds[room.rounds.length - 1] : undefined;
		const sortedPlayers = players.data.sort(
			(a, b) => this.getRelatesScore(a, lastRound) - this.getRelatesScore(b, lastRound)
		);
		if (sortedPlayers.length % 2 === 1) {
			sortedPlayers.pop();
		}
		debugger;

		const matchIds: string[] = [];
		for (let i = 0; i < sortedPlayers.length; i += 2) {
			const match = new Match(round, sortedPlayers[i], sortedPlayers[i + 1]);
			const { error } = await this.supabase.from('matches').insert(match.dbValues);
			if (error) {
				// rollback
				await this.supabase.from('rounds').delete().eq('id', data.id);
				await this.supabase.from('matches').delete().in('id', matchIds);
				throw error;
			}
			matchIds.push(match.id);
		}
	}

	private getRelatesScore(player: Player, lastRound?: Round) {
		if (!lastRound) return 0;

		const match = lastRound.matches.find(
			(m) => m.player1_id === player.id || m.player2_id === player.id
		);
		if (!match) return 0;
		if (!match.finished_at) return 0;

		return match.player1_id === player.id
			? (match.player1_score || 0) - (match.player2_score || 0)
			: (match.player2_score || 0) - (match.player1_score || 0);
	}
}

export const roomRepo = new RoomRepo(supabase);

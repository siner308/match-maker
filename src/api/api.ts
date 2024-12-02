import { createMutation, createQuery } from '@tanstack/svelte-query';
import { Room } from '../supabase/entieies/room.entity';
import { roomRepo } from '../supabase/repositories/room.repo';
import { Player } from '../supabase/entieies/player.entity';
import { playerRepo } from '../supabase/repositories/player.repo';
import { queryClient } from '../tanstack/query-client';
import { matchRepo } from '../supabase/repositories/match.repo';

export const createRoom = (onSuccess: (room: Room) => unknown) => {
	return createMutation<Room, Error, string>({
		mutationFn: async (name) => {
			const room = new Room();
			room.name = name;

			if (await roomRepo.findByName(name)) {
				throw new Error(`Room with name ${name} already exists`);
			}
			return roomRepo.save(room);
		},
		onSuccess: onSuccess
	});
};

export const getRoomDetailsByRoomId = (roomId: string) => {
	return createQuery<Room>({
		queryKey: ['rooms', roomId],
		queryFn: async () => {
			const room = await roomRepo.getDetailById(roomId);
			if (!room) {
				throw new Error(`Room with id ${roomId} not found`);
			}
			return room;
		}
	});
};

export const addPlayer = (roomId: string) => {
	return createMutation({
		mutationFn: async (name: string) => {
			const exists = await playerRepo.findByName(name);
			if (exists) {
				throw new Error(`Player with name ${name} already exists`);
			}

			const player = new Player(roomId, name);
			await playerRepo.save(player);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players', roomId] }).catch(console.error);
		}
	});
};

export const getPlayersByRoomId = (roomId: string) => {
	return createQuery<Player[]>({
		queryKey: ['players', roomId],
		queryFn: async () => {
			return playerRepo.findByRoomId(roomId);
		}
	});
};

export const startRound = (roomId: string) => {
	return createMutation({
		mutationFn: async () => {
			await roomRepo.startRound(roomId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms', roomId] }).catch(console.error);
		}
	});
};

export const changePlayerActiveState = (roomId: string) => {
	return createMutation({
		mutationFn: async ({ playerId, disabled }: { playerId: string; disabled: boolean }) => {
			const player = await playerRepo.findById(playerId);
			if (!player) {
				throw new Error(`Player with id ${playerId} not found`);
			}
			player.disabled = disabled;
			await playerRepo.save(player);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players', roomId] }).catch(console.error);
		}
	});
};

export const updatePlayerScore = (roomId: string) => {
	return createMutation({
		mutationFn: async ({
			matchId,
			playerId,
			score
		}: {
			playerId: string;
			matchId: string;
			score: number;
		}) => {
			const match = await matchRepo.findByMatchIdWithPlayers(matchId);
			if (!match) {
				debugger;
				throw new Error(`Match with id ${matchId} not found`);
			}
			if (match.player1?.id !== playerId && match.player2?.id !== playerId) {
				debugger;
				throw new Error(`Player with id ${playerId} not found in match`);
			}
			if (match.player1.id === playerId) {
				match.player1_score = score;
			}
			if (match.player2.id === playerId) {
				match.player2_score = score;
			}
			await matchRepo.save(match).catch(console.error);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['rooms', roomId] }).catch(console.error);
		}
	});
};

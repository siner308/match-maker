import type { Room } from './room.entity';
import { BaseEntity } from './base.entity';
import { Match } from './match.entity';

export class Round extends BaseEntity {
	round_number: number;
	room: Room;
	room_id: string;

	matches: Match[];

	constructor(room: Room) {
		super();

		this.round_number = 1;
		this.room = room;
		this.room_id = room.id;
		this.matches = [];
	}

	get dbValues() {
		const { room, matches: __, ...values } = this;
		return {
			...values,
			...(room?.id && { room_id: room.id })
		};
	}

	static isFinished(round: Partial<Round>) {
		if (!round) return false;
		return round.matches?.every((match) => Match.isFinished(match));
	}
}

import type { Room } from './room.entity';
import { BaseEntity } from './base.entity';
import type { Match } from './match.entity';

export class Round extends BaseEntity {
	round_number: number;
	room: Room;
	room_id: string;
	finished_at?: Date;

	matches: Match[];

	constructor(room: Room) {
		super();

		this.round_number = 1;
		this.room = room;
		this.room_id = room.id;
		this.matches = [];
	}

	get dbValues() {
		const { room: _, matches: __, ...values } = this;
		return values;
	}
}

import type { Room } from './room.entity';
import { BaseEntity } from './base.entity';

export class Player extends BaseEntity {
	name: string;
	room?: Room;
	room_id: string;
	disabled: boolean;

	constructor(roomId: string, name: string) {
		super();
		this.room_id = roomId;
		this.name = name;
		this.disabled = false;
	}
}

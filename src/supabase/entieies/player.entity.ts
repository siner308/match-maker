import type { Room } from './room.entity';
import { BaseEntity } from './base.entity';

export class Player extends BaseEntity {
	name?: string;
	room?: Room;
	room_id?: string;
}

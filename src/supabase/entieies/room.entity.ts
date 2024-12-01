import { BaseEntity } from './base.entity';
import type { Round } from './round.entity';

export class Room extends BaseEntity {
	name: string;
	description: string;

	rounds: Round[];

	constructor() {
		super();
		this.name = '';
		this.description = '';
		this.rounds = [];
	}
}

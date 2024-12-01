import { BaseEntity } from './base.entity';
import type { Round } from './round.entity';
import { Player } from './player.entity';

export class Match extends BaseEntity {
	round: Round;
	round_id: string;
	player1: Player;
	player1_id: string;
	player1_score?: number;
	player2: Player;
	player2_id: string;
	player2_score?: number;

	constructor(round: Round, player1: Player, player2: Player) {
		super();

		this.round = round;
		this.round_id = round.id;
		this.player1 = player1;
		this.player1_id = player1.id;
		this.player2 = player2;
		this.player2_id = player2.id;
	}

	get dbValues() {
		const { round: _, player1: __, player2: ___, ...values } = this;
		return values;
	}

	static isFinished(data: Partial<Match>) {
		if (!data) return false;
		return data.player1_score != undefined && data.player2_score != undefined;
	}
}

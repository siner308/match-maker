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

	constructor(data: Partial<Match>) {
		super();
		Object.assign(this, data);
	}

	get dbValues() {
		const { round, player1, player2, ...values } = this;
		return {
			...values,
			...(round?.id && { round_id: round.id }),
			...(player1?.id && { player1_id: player1.id }),
			...(player2?.id && { player2_id: player2.id })
		};
	}

	static isFinished(data: Partial<Match>) {
		if (!data) return false;
		return data.player1_score != undefined && data.player2_score != undefined;
	}
}

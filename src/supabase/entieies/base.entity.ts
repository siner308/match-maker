import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
	id: string;
	created_at: Date;

	constructor() {
		this.id = uuid();
		this.created_at = new Date();
	}
}
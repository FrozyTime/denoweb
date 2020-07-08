export class ActionResult {
	statusCode!: number;
	body!: any;

	constructor(code: number, body: any) {
		this.statusCode = code;
		this.body = body;
	}
}

export const Ok = (body?: any) => new ActionResult(200, body);
export const NotFound = (body?: any) => new ActionResult(404, body);
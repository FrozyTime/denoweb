import { Logger, OakApplication, ListenOptions, Reflection, OakRouter } from "../deps.ts"
import { ApplicationOptions, Controller, DENOWEB_CONTROLLER, ControllerOptions } from "./types.ts";
import { ControllerManager } from "./utils/ControllerManager.ts";
const Ref = Reflection as any;
export class Application {

	private logger: Logger;
	private app: OakApplication;

	constructor(options: ApplicationOptions) {
		this.logger = options.logger || new Logger();
		this.app = new OakApplication();

		if(options.controllers.length <= 0) this.logger.warn("[DenoWeb] Controllers array is empty!");

		for(let controller of options.controllers) {
			ControllerManager.registerController(controller, this.app, this.logger);
		}
	}

	serve(options: string | ListenOptions): Promise<void> {
		let addr = "";
		
		if(typeof options === "string") addr = options;
		else addr = options.port.toString();

		this.logger.info(`[DenoWeb] Listening on ${addr}`);
		return this.app.listen(options as any);
	}

}
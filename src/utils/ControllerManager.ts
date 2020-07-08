import { OakApplication, Logger, Reflection, OakRouter, OakContext } from "../../deps.ts";
import { ControllerOptions, DENOWEB_CONTROLLER, DENOWEB_ROUTE, RouteOptions } from "../types.ts";
import { ActionResult } from "../ActionResult.ts";

const Ref = Reflection as any;

const getInstanceMethodNames = (obj: any) =>
	Object
		.getOwnPropertyNames(Object.getPrototypeOf(obj))
		.filter(name => (name !== "constructor" && typeof obj[name] === "function"));

const responseFromType = async (result: any, ctx: OakContext): Promise<any> => {
	if(!result) {
		ctx.response.status = 204;
	} else if (result instanceof ActionResult) {
		ctx.response.status = result.statusCode;
		ctx.response.body = result.body;
	} else if (result instanceof Promise) {
		const resultWaited = await result;
		return await responseFromType(resultWaited, ctx);
	} else {
		ctx.response.status = 200;
		ctx.response.body = result;
	}
}

const routeMethod = (router: OakRouter, method: string, path: string, controller: any) => {
	if(method === "get") {
		router.get(path, controller);
	} else if (method === "post") {
		router.get(path, controller);
	} else {
		router.get(path, controller);
	}
}

const ensureSlash = (str: string) : string => {
	return str[0] === "/" ? str : "/" + str;
};

const combinePaths = (firstPath?: string, secondPath?: string): string => {
	if(!firstPath && !secondPath) return "/";

	if(!firstPath && secondPath) return ensureSlash(secondPath);
	if(!secondPath && firstPath) return ensureSlash(firstPath);
	
	return "/";
};

export class ControllerManager {
	static registerController(controller: Function, app: OakApplication, logger: Logger) {
		const meta = Ref.getMetadata(DENOWEB_CONTROLLER, controller) as ControllerOptions;
		if(!meta || !meta.controller) return logger.warn("[DenoWeb] Class in controllers was not decorated with @Controller(). Ignoring!");
		const instanciatedController = new (controller as any)();

		const methods = getInstanceMethodNames(instanciatedController);
		const controllerRouter = new OakRouter();

		for(let method of methods) {
			this.registerRoute(instanciatedController, controllerRouter, logger, method, meta);
		}

		app.use(controllerRouter.routes());
		app.use(controllerRouter.allowedMethods());
	}

	static registerRoute(controller: any, router: OakRouter, logger: Logger, method: string, controllerOptions: ControllerOptions) {
		const meta = Ref.getMetadata(DENOWEB_ROUTE, controller[method]) as RouteOptions;
		if(!meta || !meta.method) return logger.warn("[DenoWeb] Method in controller was not decorated with a method. Ignoring it!");
		
		const path = combinePaths(controllerOptions.path, meta.path);
		routeMethod(router, meta.method, path, controller[method]);
		logger.info(`Registered route: ${path}`);
	}
}
import { Logger, Reflection } from "../deps.ts";
const Ref = Reflection as any;

const DENOWEB_CONTROLLER = "denoweb:controller";
const DENOWEB_ROUTE = "denoweb:route";

export interface ApplicationOptions {
	controllers: Function[];
	logger?: Logger;
}

export interface ControllerOptions {
	controller: boolean;
	path?: string;
}

export interface RouteOptions {
	method: string;
	path?: string;
}

const Controller = (path?: string) : ClassDecorator => {
	return (target: Function) => {
		Ref.defineMetadata(
			DENOWEB_CONTROLLER,
			{
				"controller": true,
				path
			} as ControllerOptions,
		target);
	};
};

const Get = (path?: string) : MethodDecorator => {
	return (target: Object, propertyKey: string | symbol, descriptor: any) => {
		Ref.defineMetadata(
			DENOWEB_ROUTE,
			{
				"method": "get",
				path
			} as RouteOptions,
		descriptor.value);
	};
};

export {
	Controller,
	Get,
	DENOWEB_ROUTE,
	DENOWEB_CONTROLLER
}
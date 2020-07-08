import {Application, Logger, ColourConsoleTransport, OakContext} from "../../mod.ts";
import { Controller, Get } from "../types.ts";

const logger = new Logger();

logger.addTransport(new ColourConsoleTransport());

@Controller()
class Hello {
	@Get()
	test(ctx: OakContext) {
		ctx.response.status = 200;
		ctx.response.body = "Hello, World!";
	}

	// test1() {

	// }

	// test2() {

	// }
}

class NotAController {

}

const app = new Application({
	"controllers": [Hello],
	logger
});

await app.serve({ "port": 3000});
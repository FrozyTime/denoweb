dep:
	deno run -A -c tsconfig.json deps.ts

example:
	deno run -A -c tsconfig.json src/example/app.ts

test:
	deno test -A -c tsconfig.json src/tests
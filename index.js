import parse from "./src/parse";
import request from "./src/request";
import scale from "./src/scale";
import * as cache from "./src/cache";

fly.http.respondWith(async req => {
	const config = parse(req);
	const key = cache.key(req);
	const hit = await cache.get(key);

	if (hit) return new Response(hit, { headers: { "x-cache": "hit" } });

	const res = await request(config.image);
	const scaled = await scale(res, config);
	await cache.set(key, scaled.data);

	return new Response(scaled.data, { headers: { "x-cache": "miss" } });
});

const param = (url, parameter) => {
    let reg = new RegExp("[?&]" + parameter + "=([^&#]*)", "i");
    let res = reg.exec(url);

    return res ? res[1] : null;
};

const error = msg => {
	throw new Error(msg);
};

const parse = req => {
	const url = req.url;

	return {
		image:
			param(url, "image") ||
			param(url, "img") ||
			param(url, "source") ||
			param(url, "src") ||
			error("Image parameter must be provided"),
		height: Number(param(url, "height") || param(url, "h")),
		width: Number(param(url, "width") || param(url, "w"))
	};
};

const request = async (url) => {
	const redirects = [301, 302, 303, 307, 308]
	const maxHops = 5;
	let hops = 0;
	
	while (hops < maxHops) {
		let res = await fetch(url);

		if (redirects.indexOf(res.status) == -1) 
			return res;

		url = res.headers.get("location")
		hops++;
	}

	error(`Max number of hops (${maxHops}) has been reached`)
};

const scale = async (res, config) => {
	let image = new fly.Image(await res.arrayBuffer());
	let meta = image.metadata();
	let ratio = meta.width / meta.height;

	if (config.width && config.height)
		image = image.resize(config.width, config.height);
	else if (config.width)
		image = image.resize(config.width, Math.round(config.width / ratio))
	else if (config.height)
		image = image.resize(Math.round(config.height * ratio), config.height);

	return await image.withoutEnlargement().toImage();
};


fly.http.respondWith(async req => {
	const config = parse(req);
	const res = await request(config.image)
	const scaled = await scale(res, config)

	return new Response(scaled.data);
});

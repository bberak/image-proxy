import { error } from "./utils"

const parse = req => {
	const url = new URL(req.url);
	const find = name => url.searchParams.get(name);

	return {
		image:
			find("image") ||
			find("img") ||
			find("source") ||
			find("src") ||
			error("Image parameter must be provided"),
		height: Number(find("height") || find("h")),
		width: Number(find("width") || find("w"))
	};
};

export default parse
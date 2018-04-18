const { error, param, fragment } = require("./utils");

const parse = url => {
	const find = name => param(url, name);

	return {
		image:
			find("image") ||
			find("img") ||
			find("source") ||
			find("src") ||
			fragment(url) ||
			error("Image parameter must be provided"),
		height: Number(find("height") || find("h")),
		width: Number(find("width") || find("w"))
	};
};

module.exports = parse;

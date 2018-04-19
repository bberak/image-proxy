const { error, param } = require("./utils");

const parse = url => {
	const find = name => param(url, name);
	const height = find("height") || find("h");
	const width = find("width") || find("w");
	return {
		image:
			find("image") ||
			find("img") ||
			find("source") ||
			find("src") ||
			error(`Image parameter not found in url: ${url}`),
		height: height && Number(height),
		width: width && Number(width)
	};
};

module.exports = parse;

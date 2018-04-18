const url = require("url");

const error = msg => {
	throw new Error(msg);
};

const param = (url, field) => {
	let reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
	let string = reg.exec(url);

	return string ? string[1] : null;
};

const fragment = (urlString = "", num = 0) => {
	return (url.parse(urlString).pathname || "").split("/")[++num];
};

module.exports = {
	error,
	param,
	fragment
};

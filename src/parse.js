import { error } from "./utils"

const param = (url, parameter) => {
    let reg = new RegExp("[?&]" + parameter + "=([^&#]*)", "i");
    let res = reg.exec(url);

    return res ? res[1] : null;
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

export default parse
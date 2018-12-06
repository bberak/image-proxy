const parse = require("./src/parse");
const request = require("./src/request");
const logger = require("./src/log");
const { create, resize, getMetadata, toBuffer, raw, orient, toFormat, withMetadata, withoutEnlargement } = require("./src/sharp");
const { pipe, cond, then, log } = require("./src/utils");
const filters = require("./src/filters");

const ok = ({ callback, data, info }) => {
	callback(null, {
		status: 200,
		body: data.toString("base64"),
		bodyEncoding: "base64",
		headers: {
			"content-type": [
				{
					key: "Content-Type",
					value: `image/${info.format}`
				}
			]
		}
	});
};

const exception = ({ callback, error, url, event, config }) => {
	callback(null, {
		body: JSON.stringify({
			message: error.message,
			url: url,
			event: event,
			config: config
		}),
		status: 500
	});
};

exports.handler = (event, context, callback) => {
	const { uri = "/", querystring = "", headers = {} } = event.Records[0].cf.request;
	const url = `${uri}?${querystring}`;
	const config = parse(url)
	const looping = Object.keys(headers).find(h => h.toLowerCase() == "x-theimgco");
		
	if (looping)
		throw new Error("Found an x-theimgco header. Aborting operation.")

	const download = request(config.image);

	const standard = pipe(
		create(),
		withMetadata(),
		withoutEnlargement(),
		resize(config.width, config.height),
		toBuffer()
	);

	const filtered = pipe(
		create(),
		withMetadata(),
		withoutEnlargement(),
		resize(config.width, config.height),
		getMetadata(),
		then(({ image, metadata }) =>
			pipe(
				raw(),
				toBuffer(),
				then(({ data, info }) =>
					pipe(
						filters.get(config.filter)(info),
						then(pipe(
							orient(metadata.orientation),
							toFormat(metadata.format),
							toBuffer()
						))
					)(data)
				)
			)(image)
		)
	);

	download
		.then(res => config.filter ? filtered(res.data) : standard(res.data))
		.then(({ data, info }) => ok({ callback, data, info  }))
		.catch(error => exception({ callback, error, url, event, config }));
};

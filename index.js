const parse = require("./src/parse");
const request = require("./src/request");
const log = require("./src/log");
const sharp = require("sharp");
const filterous = require("filterous");

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

	request(config.image)
		.then(res => res.data)
		.then(sharp)
		.then(img => img.resize(config.width, config.height))
		.then(img => img.withoutEnlargement())
		.then(img => config.metadata ? img.withMetadata() : img)
		.then(img => img.toBuffer({ resolveWithObject: true  }))		
		.then(({ data, info }) => {
			if (config.filter) {
				return filterous
					.importImage(data)
					.applyInstaFilter(config.filter)
					.toBuffer()
					.then(data => ({ data, info }))
			}

			return { data, info }
		})
		.then(({ data, info }) => ok({ callback, data, info }))
		.catch(error =>  exception({ callback, error, event, url, config }))

};

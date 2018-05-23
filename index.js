const parse = require("./src/parse");
const request = require("./src/request");
const log = require("./src/log");
const { load, scale } = require("./src/image");

const ok = (callback, res) => {
	log(res);
	callback(null, {
		status: 200,
		body: res.output.toString("base64"),
		bodyEncoding: "base64",
		headers: {
			"content-type": [
				{
					key: "Content-Type",
					value: `image/${res.outputMeta.format}`
				}
			]
		}
	});
};

const error = (callback, res) => {
	log(res);
	callback(null, {
		body: JSON.stringify({
			message: res.error.message,
			url: res.url,
			event: res.event
		}),
		status: 500
	});
};

exports.handler = (event, context, callback) => {
	const { uri = "/", querystring = "" } = event.Records[0].cf.request;
	const url = `${uri}?${querystring}`;
	const res = { event, context, url };

	new Promise(resolve => {
		//-- Parse the input parameters
		resolve(parse(url));
	})
		.then(config => {
			//-- Request the original image
			res.config = config;
			return request(config.image);
		})
		.then(({ data }) => {
			//-- Load the image data
			return load(data);
		})
		.then(source => {
			//-- Get the original metadata
			res.source = source;
			return source.metadata();
		})
		.then(meta => {
			//-- Scale the image
			res.sourceMeta = meta;
			//res.sourceMeta.size = res.source.byteLength;
			console.log("keys", Object.keys(res.source));
			console.log("source", res.source);
			console.log("typeof", typeof res.source);

			return scale({ source: res.source, config: res.config });
		})
		.then(({ data, info }) => {
			//-- Respond with the scaled image

			res.output = data;
			res.outputMeta = info;
			ok(callback, res);
		})
		.catch(err => {
			//-- Respond with an error
			res.error = err;
			error(callback, res);
		});
};

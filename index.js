const parse = require("./src/parse");
const request = require("./src/request");
const log = require("./src/log");
const { load, scale } = require("./src/image");

const ok = (callback, res) => {
	log(res);
	callback(null, {
		status: 200,
		body: res.outputData.toString("base64"),
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
		res.sourceData = data;
		return load(data);
	})
	.then(image => {
		//-- Get the original metadata
		res.image = image;
		return image.metadata();
	})
	.then(sourceMeta => {
		//-- Scale the image
		res.sourceMeta = sourceMeta;
		return scale({ image: res.image, config: res.config });
	})
	.then(({ data, info }) => {
		//-- Respond with the scaled image
		res.outputData = data;
		res.outputMeta = info;
		ok(callback, res);
	})
	.catch(err => {
		//-- Respond with an error
		res.error = err;
		error(callback, res);
	});
};

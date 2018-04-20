const parse = require("./src/parse");
const request = require("./src/request");
const scale = require("./src/scale");

const send = ({ callback, output, source }) => {
	callback(null, {
		status: 200,
		body: output.toString("base64"),
		bodyEncoding: "base64",
		headers: {
			"content-type": [
				{
					key: "Content-Type",
					value: source.headers["content-type"]
				}
			]
		}
	});
};

const error = ({ callback, url, err, event }) => {
	console.log(url, err, JSON.stringify(event));
	callback(null, {
		body: JSON.stringify({ message: err.message, url, event }),
		status: 500
	});
};

exports.handler = (event, context, callback) => {
	const { uri = "/", querystring = "" } = event.Records[0].cf.request;
	const url = `${uri}?${querystring}`;

	new Promise(resolve => resolve(parse(url)))
		.then(config => Promise.all([request(config.image), config]))
		.then(([source, config]) => Promise.all([scale({ buffer: source.data, config }), source]))
		.then(([output, source]) => send({ callback, output, source }))
		.catch(err => error({ callback, url, err, event }));
};

const parse = require("./src/parse");
const request = require("./src/request");
const scale = require("./src/scale");

const send = ({ callback, output }) => {
	callback(null, {
		status: 200,
		body: output.data.toString("base64"),
		bodyEncoding: "base64",
		headers: {
			"content-type": [
				{
					key: "Content-Type",
					value: `image/${output.info.format}`
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
		.then(([source, config]) => scale({ buffer: source.data, config }))
		.then(output => send({ callback, output }))
		.catch(err => error({ callback, url, err, event }));
};

const parse = require("./src/parse");
const request = require("./src/request");
const scale = require("./src/scale");

exports.handler = (event, context, callback) => {
	console.log("event", JSON.stringify(event));

	const { uri = "/", querystring = "" } = event.Records[0].cf.request;
	const url = `${uri}?${querystring}`;

	console.log("url", url);

	new Promise(resolve => resolve(parse(url)))
		.then(config => Promise.all([request(config.image), config]))
		.then(([source, config]) =>
			Promise.all([scale(source.data, config), source])
		)
		.then(([output, source]) => {
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
		})
		.catch(err =>
			callback(null, {
				body: `Something went wrong: ${url} ${err} ${JSON.stringify(
					event
				)}`,
				status: 500
			})
		);
};

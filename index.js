const sharp = require("sharp");
const parse = require("./src/parse");

exports.handler = (event, context, callback) => {
	try {
		const config = parse(event.Records[0].cf.uri);

		callback(null, {
			body: "Hello from The Neap Team =) " + JSON.stringify(config),
			headers: {
				"x-neap": [
					{
						key: "X-Neap",
						value: "true"
					}
				]
			},
			status: 200
		});
	} catch (err) {
		callback(null, {
			body: "Something went wrong: " + JSON.stringify(err),
			headers: {
				"x-neap": [
					{
						key: "X-Neap",
						value: "true"
					}
				]
			},
			status: 500
		});
	}

	callback(null, response);
};

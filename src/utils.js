const AWS = require("aws-sdk");
const firehose = new AWS.Firehose();

const error = msg => {
	throw new Error(msg);
};

const param = (url, field) => {
	let reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
	let string = reg.exec(url);

	return string ? string[1] : null;
};

const hosify = (logger, logStreamName, errorStreamName) => {
	const _log = logger.log;
	const _error = logger.error;

	_log("Get here", logStreamName);

	if (logStreamName) {

		logger.log = (...args) => {

			_log("log called...")

			_log.apply(null, args);

			const request = firehose.putRecord({
				DeliveryStreamName: logStreamName,
				Record: {
					Data: new Buffer(JSON.stringify(args))
				}
			});

			request.send();
		};

	}

	/*
	if (errorStreamName) {
		logger.error = (...args) => {
			_error.apply(null, args);

			firehose.putRecord({
				DeliveryStreamName: errorStreamName,
				Record: {
					Data: JSON.stringify(args)
				}
			});
		};
	}
	*/

	return logger;
};

module.exports = {
	error,
	param,
	hosify
};

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

module.exports = {
	error,
	param
};

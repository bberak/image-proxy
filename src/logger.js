const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const firehose = new AWS.Firehose();

const log = args => {
	const {
		event = {},
		error = {},
		url = "",
		context = {},
		config = {},
		sourceData = {},
		sourceMeta = {},
		outputMeta = {},
		error = {}
	} = args;

	const data = {
		invocation_id: context.awsRequestId,
		width_param: config.width,
		height_param: config.height,
		image_param: config.image,
		filter_param: config.filter,
		source_width: sourceMeta.width,
		source_height: sourceMeta.height,
		source_format: sourceMeta.format,
		source_bytes: sourceData.length,
		output_width: outputMeta.width,
		output_height: outputMeta.height,
		output_format: outputMeta.format,
		output_bytes: outputMeta.size,
		error: error.message,
		timestamp: new Date().getTime() / 1000
	};

	console.log(data);

	const request = firehose.putRecord({
		DeliveryStreamName: "theimgco-lambda-to-s3",
		Record: {
			Data: new Buffer(JSON.stringify(data) + "\n")
		}
	});

	request.send();

	return args;
};

module.exports = log;

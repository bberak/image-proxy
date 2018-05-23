const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const firehose = new AWS.Firehose();

const log = args => {
	//-- invocation_id, width_param, height_param, image_param,
	//-- source_width, source_height, source_bytes, source_format,
	//-- output_width, output_height, output_bytes, output_format,
	//-- error

	const {
		context,
		config,
		sourceMeta,
		outputMeta,
		error
	} = args;

	const data = {
		invocation_id: context && context.awsRequestId,
		width_param: config && config.width,
		height_param: config && config.height,
		image_param: config && config.image,
		sourceMeta: sourceMeta,
		outputMeta: outputMeta,
		error: error && error.message
	};

	console.log(data);

	const request = firehose.putRecord({
		DeliveryStreamName: "theimgco-lambda-to-s3",
		Record: {
			Data: new Buffer(JSON.stringify(data))
		}
	});

	request.send();

	return args;
};

module.exports = log;

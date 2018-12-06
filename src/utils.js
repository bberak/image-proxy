const AWS = require("aws-sdk");
const firehose = new AWS.Firehose();
const _ = require("lodash");

const error = msg => {
	throw new Error(msg);
};

const param = (url, field) => {
	let reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
	let string = reg.exec(url);

	return string ? string[1] : null;
};

const pipe = (...funcs) => _.flow(_.flatten(funcs || []))

const cond = (condition, func) => {
	return (args) => {
		const test = _.isFunction(condition) ? condition(args) : condition
		return test ? func(args) : args
	}
}

const then = handler => promise => promise.then(handler);

const log = label => args => {
	console.log(label, args)
	return args;
};

const map = (func, mapper) => input => {
	const output = func(input);
	return mapper(input, output)
};

const thenMap = (func, handler) => input => func(input).then(output => handler(input, output));

const promise = () => anything => new Promise(resolve => resolve(anything));

module.exports = {
	error,
	param,
	pipe,
	cond,
	then,
	log,
	map,
	thenMap,
	promise
};

const assert = require("assert");
const parse = require("../src/parse");

describe("parse-1", () => {
	it("should throw error when no image parameter is present", () => {
		assert.throws(
			() => parse("/"),
			Error,
			"Image parameter not found in url: /"
		);
	});
});

describe("parse-2", () => {
	it("should throw error when no image parameter is present", () => {
		assert.throws(
			() => parse("/img=123"),
			Error,
			"Image parameter not found in url: /img=123"
		);
	});
});

describe("parse-3", () => {
	it("should throw error when no image parameter is present", () => {
		assert.throws(
			() => parse("/image.jpeg"),
			Error,
			"Image parameter not found in url: /image.jpeg"
		);
	});
});

describe("parse-4", () => {
	it("should find image fragment and height", () => {
		assert.throws(
			() => parse("/img/?h=23"),
			Error,
			"Image parameter not found in url: /img/?h=23"
		);
	});
});

describe("parse-5", () => {
	it("should throw error when no image parameter is present", () => {
		assert.throws(
			() => parse(""),
			Error,
			"Image parameter not found in url: "
		);
	});
});

describe("parse-6", () => {
	it("should throw error when no image parameter is present", () => {
		assert.throws(
			() => parse("/?h=23424"),
			Error,
			"Image parameter not found in url: /?h=23424"
		);
	});
});

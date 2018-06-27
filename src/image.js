const sharp = require("sharp");
const filterous = require("filterous");

const load = buffer => {
	return sharp(buffer);
};

const scale = ({ image, config }) => {
	return image
		.resize(config.width, config.height)
		.withoutEnlargement()
		.toBuffer({ resolveWithObject: true });
};

const applyFilter = ({ buffer, filter }) => {
	if (filter) {
		return filterous
			.importImage(buffer)
			.applyInstaFilter(filter)
			.toBuffer();
	}

	return buffer;
}

module.exports = {
	load,
	scale,
	applyFilter
};

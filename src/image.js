const sharp = require("sharp");

const load = buffer => {
	return sharp(buffer);
};

const scale = ({ image, config }) => {
	return image
		.resize(config.width, config.height)
		.withoutEnlargement()
		.toBuffer({ resolveWithObject: true });
};

module.exports = {
	load,
	scale
};

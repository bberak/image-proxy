const sharp = require("sharp");

const scale = (buffer, config) => {

	console.log(sharp.format);
	
	return sharp(buffer)
		.resize(config.width, config.height)
		.withoutEnlargement()
		.toBuffer();
};

module.exports = scale;

const sharp = require("sharp");

const scale = ({ buffer, config }) => {
	return new Promise((resolve, reject) => {
		sharp(buffer)
			.resize(config.width, config.height)
			.withoutEnlargement()
			.toBuffer((err, data, info) => {
				if (err) reject(err);

				resolve({ data, info });
			});
	});
};

module.exports = scale;

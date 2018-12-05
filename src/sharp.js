const sharp = require("sharp");

const create = options => buffer => sharp(buffer, options).withoutEnlargement().withMetadata();

const withMetadata = () => image => image.withMetadata();

const withoutEnlargement = () => image => image.withoutEnlargement();

const resize = (width, height) => image => image.resize(width, height);

const orient = orientation => image => image.withMetadata({ orientation });

const raw = () => image => image.raw();

const toBuffer = () => image => image.toBuffer({ resolveWithObject: true });

const toFormat = format => image => image.toFormat(format);

const getMetadata = () => image => image.metadata().then(metadata => ({ image, metadata }));

const overlayWith = (buffer, options) => image => image.overlayWith(buffer, options);

module.exports = {
	sharp,
	create,
	withMetadata,
	withoutEnlargement,
	resize,
	orient,
	raw,
	toBuffer,
	toFormat,
	getMetadata,
	overlayWith
};
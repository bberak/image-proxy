const scale = async (res, config) => {
	let image = new fly.Image(await res.arrayBuffer());
	let meta = image.metadata();
	let ratio = meta.width / meta.height;

	if (config.width && config.height)
		image = image.resize(config.width, config.height);
	else if (config.width)
		image = image.resize(config.width, Math.round(config.width / ratio))
	else if (config.height)
		image = image.resize(Math.round(config.height * ratio), config.height);

	return await image.withoutEnlargement().toImage();
};

export default scale
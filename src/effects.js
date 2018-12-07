const assert = require('assert');

/**
 * References
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * Grayscale https://en.wikipedia.org/wiki/Grayscale
 * Sepia https://software.intel.com/sites/default/files/article/346220/sepiafilter-intelcilkplus.pdf
 * Brightness https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 * Hue Saturation hhttps://gist.github.com/mjackson/5311256
 * Persceived saturation with RGB https://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation/34183839#34183839
 * Contrast http://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
 */

const RGBtoHSV = (r, g, b) => {
	(r /= 255), (g /= 255), (b /= 255);

	let max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		v = max;

	let d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return [h, s, v];
};

const HSVtoRGB = (h, s, v) => {
	let r, g, b;

	let i = Math.floor(h * 6);
	let f = h * 6 - i;
	let p = v * (1 - s);
	let q = v * (1 - f * s);
	let t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	return [r * 255, g * 255, b * 255];
};

const clamp = val => val > 255 ? 255 : val < 0 ? 0 : val;

const grayscale = channels => pixels => {
	for (let i = 0; i < pixels.length; i += channels) {
		let r = pixels[i],
			g = pixels[i + 1],
			b = pixels[i + 2];
		let avg = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
	}
	return pixels;
};

//-- Adj is 0 (unchanged) to 1 (sepia)
const sepia = (channels, adj) => pixels => {
	for (let i = 0; i < pixels.length; i += channels) {
		let r = pixels[i],
			g = pixels[i + 1],
			b = pixels[i + 2];
		pixels[i] = r * (1 - 0.607 * adj) + g * 0.769 * adj + b * 0.189 * adj;
		pixels[i + 1] =
			r * 0.349 * adj + g * (1 - 0.314 * adj) + b * 0.168 * adj;
		pixels[i + 2] =
			r * 0.272 * adj + g * 0.534 * adj + b * (1 - 0.869 * adj);
	}
	return pixels;
};

const invert = channels => pixels => {
	for (let i = 0; i < pixels.length; i += channels) {
		pixels[i] = 255 - pixels[i];
		pixels[i + 1] = 255 - pixels[i + 1];
		pixels[i + 2] = 255 - pixels[i + 2];
	}
	return pixels;
};

//-- adj should be -1 (darker) to 1 (lighter). 0 is unchanged.
const brightness = (channels, adj) => pixels => {
	adj = adj > 1 ? 1 : adj;
	adj = adj < -1 ? -1 : adj;
	adj = ~~(255 * adj);
	for (let i = 0; i < pixels.length; i += channels) {
		pixels[i] = clamp(pixels[i] + adj);
		pixels[i + 1] = clamp(pixels[i + 1] + adj);
		pixels[i + 2] = clamp(pixels[i + 2] + adj);
	}
	return pixels;
};

//-- Better result (slow) - adj should be < 1 (desaturated) to 1 (unchanged) and < 1
const hueSaturation = (channels, adj) => pixels => {
	for (let i = 0; i < pixels.length; i += channels) {
		let hsv = RGBtoHSV(pixels[i], pixels[i + 1], pixels[i + 2]);
		hsv[1] *= adj;
		let rgb = HSVtoRGB(hsv[0], hsv[1], hsv[2]);
		pixels[i] = rgb[0];
		pixels[i + 1] = rgb[1];
		pixels[i + 2] = rgb[2];
	}
	return pixels;
};

//-- Perceived saturation (faster) - adj should be -1 (desaturated) to positive number. 0 is unchanged
const saturation = (channels, adj) => pixels => {
	adj = adj < -1 ? -1 : adj;
	for (let i = 0; i < pixels.length; i += channels) {
		let r = pixels[i],
			g = pixels[i + 1],
			b = pixels[i + 2];
		let gray = 0.2989 * r + 0.587 * g + 0.114 * b; //-- Weights from CCIR 601 spec
		pixels[i] = clamp(-gray * adj + pixels[i] * (1 + adj));
		pixels[i + 1] = clamp(-gray * adj + pixels[i + 1] * (1 + adj));
		pixels[i + 2] = clamp(-gray * adj + pixels[i + 2] * (1 + adj));
	}
	return pixels;
};

//-- Contrast - the adj value should be -1 to 1
const contrast = (channels, adj) => pixels => {
	adj *= 255;
	let factor = (259 * (adj + 255)) / (255 * (259 - adj));
	for (let i = 0; i < pixels.length; i += channels) {
		pixels[i] = factor * (pixels[i] - 128) + 128;
		pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
		pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
	}
	return pixels;
};

//-- ColorFilter - add a slight color overlay. rgbColor is an array of [r, g, b, adj]
const colorFilter = (channels, rgbColor) => pixels => {
	let adj = rgbColor[3];
	for (let i = 0; i < pixels.length; i += channels) {
		pixels[i] -= (pixels[i] - rgbColor[0]) * adj;
		pixels[i + 1] -= (pixels[i + 1] - rgbColor[1]) * adj;
		pixels[i + 2] -= (pixels[i + 2] - rgbColor[2]) * adj;
	}
	return pixels;
};

//-- RGB Adjust
const rgbAdjust = (channels, rgbAdj) => pixels => {
	for (var i = 0; i < pixels.length; i += channels) {
		pixels[i] *= rgbAdj[0]; //R
		pixels[i + 1] *= rgbAdj[1]; //G
		pixels[i + 2] *= rgbAdj[2]; //B
	}
	return pixels;
};

//-- Convolute - weights are 3x3 matrix
const convolute = (channels, weights, width, height) => pixels => {
	let side = Math.round(Math.sqrt(weights.length));
	let halfSide = ~~(side / 2);

	let sw = width;
	let sh = height;

	let w = sw;
	let h = sh;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let sy = y;
			let sx = x;
			let dstOff = (y * w + x) * channels;
			let r = 0,
				g = 0,
				b = 0;
			for (let cy = 0; cy < side; cy++) {
				for (let cx = 0; cx < side; cx++) {
					let scy = sy + cy - halfSide;
					let scx = sx + cx - halfSide;
					if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
						let srcOff = (scy * sw + scx) * channels;
						let wt = weights[cy * side + cx];
						r += pixels[srcOff] * wt;
						g += pixels[srcOff + 1] * wt;
						b += pixels[srcOff + 2] * wt;
					}
				}
			}
			pixels[dstOff] = r;
			pixels[dstOff + 1] = g;
			pixels[dstOff + 2] = b;
		}
	}
	return pixels;
};

const blend = overlay => base => {
	assert.equal(base.length, overlay.length, "Pixel buffers must be the same size when blending");

	let rA,gA,bA,aA,rB,gB,bB,aB = 0 

	for (var i = 0; i < base.length; i += 4) {
		
		rA = overlay[i];
		gA = overlay[i + 1];
		bA = overlay[i + 2];
		aA = overlay[i + 3];

		rB = base[i];
		gB = base[i + 1];
		bB = base[i + 2];
		aB = base[i + 3];

		base[i]      = (rA * aA / 255) + (rB * aB * (255 - aA) / (255*255))
		base[i + 1]  = (gA * aA / 255) + (gB * aB * (255 - aA) / (255*255))
		base[i + 2]  = (bA * aA / 255) + (bB * aB * (255 - aA) / (255*255))
		base[i + 3]  = aA + (aB * (255 - aA) / 255)
	}

	return base;
};

module.exports = {
	RGBtoHSV,
	HSVtoRGB,
	grayscale,
	greyscale: grayscale,
	sepia,
	invert,
	brightness,
	hueSaturation,
	saturation,
	contrast,
	colorFilter,
	rgbAdjust,
	convolute,
	blend
};
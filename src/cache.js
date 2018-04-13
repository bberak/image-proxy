import md5 from "md5"

const ignoredParams = "utm_source|utm_medium|utm_campaign|utm_content|gclid|cx|ie|cof|siteurl".split("|")

const normalizeUrl = url => {
	const u = new URL(url);
	const sp = u.searchParams;
	for (const p of ignoredParams) {
		sp.delete(p);
	}
	sp.sort();
	u.search = sp.toString();
	return u;
};

const generateCacheKey = (method, url, headers) => {
  return md5([method, url.toString()].join(":"))
}

export const key = req => {
	const url = normalizeUrl(req.url);
  	return generateCacheKey(req.method, url)
}

export const get = str => {
	return fly.cache.get(str);
}

export const set = (str, data, ttl) => {
	return fly.cache.set(str, data, ttl);
}
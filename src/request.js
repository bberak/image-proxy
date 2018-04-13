import { error } from "./utils"

const request = async (url) => {
	const redirects = [301, 302, 303, 307, 308]
	const maxHops = 5;
	let hops = 0;
	
	while (hops < maxHops) {
		let res = await fetch(url);

		if (redirects.indexOf(res.status) == -1) 
			return res;

		url = res.headers.get("location")
		hops++;
	}

	error(`Max number of hops (${maxHops}) has been reached`)
};

export default request
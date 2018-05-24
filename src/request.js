const { error } = require("./utils");
const axios = require("axios");

const request = url => {
	return axios.get(url, {
		headers: {
			"x-theimgco": "Nothing to worry about, just some security"
		},
      	responseType: "arraybuffer"
    })
};

module.exports = request;
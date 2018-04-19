const { error } = require("./utils");
const axios = require("axios");

const request = url => {
	return axios.get(url, {
      responseType: "arraybuffer"
    })
};

module.exports = request;
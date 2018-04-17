const sharp = require('sharp');

exports.handler = async (event) => {
	
    console.log("event", event)
    console.log("sharp", sharp);

    //return 'Hello from Lambda!'

    const response = {
	    body: 'This is coming from the Lambda!',
	    bodyEncoding: 'text',
	    headers: {
	        'x-neap': [{
	            key: 'X-Neap',
	            value: 'true'
	         }]
	    },
	    status: 200,
	};
};

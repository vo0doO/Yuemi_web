exports.getFeed = (cb) => {
	fetch('/api/downloads')
		.then(response => {
			return response.json();
		})
		.then(json => {
			cb(json);
		})
		.catch(error => {
			console.log('ERROR_GETTING_FEED: ' + error);
		});
};

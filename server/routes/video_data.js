var axios = require('axios');

exports.getVideoTitle = ({params}, res) => {
	const re = /^[a-zA-Z0-9_-]+$/;
	const ti = '&title=';
	if (re.test(params.id)) {
		axios.get('http://youtube.com/get_video_info?video_id=' + params.id)
			.then((body) => {
				console.log('TITLE_RETREIVAL_SUCCESSFUL: ' + params.id);
				res.status(200).send(body.data.slice(body.data.indexOf(ti) + ti.length).split('&')[0]);
			});
	} else {
		console.log(`ILLEGAL_STRING: ${params.id}`);
		res.status(400).send(`ILLEGAL_STRING: ${params.id}`);
	}
};

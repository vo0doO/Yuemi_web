var request = require('request');
var cheerio = require('cheerio');

module.exports = ({params}, res) => {
	const idIndicator = '?v=';
	const idIndex = params.query.indexOf(idIndicator);
	if (idIndex != -1) {
		var newQuery = params.query.slice(idIndex + idIndicator.length);
	}
	const url = `http://www.youtube.com/results?search_query=${encodeURIComponent(newQuery || params.query)}`;
	const videos = [];
	request(url, (err, {statusCode}, body) => {
		if (err) {
			console.log(`SEARCH_ERROR: ${err}`);
			res.status(statusCode >= 100 && statusCode < 600 ? statusCode : 500).send(`SEARCH_ERROR: ${err}`);
		} else {
			const $ = cheerio.load(body);
			let lockupTitle;
			let lockupMeta;
			let lockupByline;
			let attribs;
			let duration;
			let title;
			let href;
			let views;
			let uploader;
			$('.yt-lockup-content').each(function () {
				try {
					lockupTitle = $(this).find($('.yt-lockup-title'));
					lockupMeta = $(this).find($('.yt-lockup-meta-info li'));
					lockupByline = $(this).find($('.yt-lockup-byline'));

					attribs = lockupTitle.children()[0].attribs;
					duration = lockupTitle.find($('span[class=accessible-description]')).html();
					duration = duration.substr(0, duration.length - 1);
					title = attribs.title;
					href = attribs.href;
					uploader = lockupByline.find($('a')).html();

					views = lockupMeta.eq(1).text();

					if (/\d/.test(duration)) {
						videos.push({
							title,
							views,
							uploader,
							_id: href.substr(9),
							duration: duration.substr(13)
						});
					}
				} catch (e) {
					// Not a video
				}
			});
			console.log(`SEARCH_SUCCESS: ${params.query}`);
			res.json({
				videos
			});
		}
	});
};

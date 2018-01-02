var mongoose = require('mongoose');
var Download = require('./schema.js').Download;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/yuemi', { useMongoClient: true });

exports.addDownloadToDatabase = (req, res) => {
	const body = req.body;
	const _id = body._id;
	const title = body.title;
	const duration = body.duration;
	const uploader = body.uploader;
	const views = body.views;
	Download.findOneAndUpdate(
		{ _id },
		{
			_id,
			title,
			duration,
			views,
			uploader,
			$inc: { 'downloads': 1 }
		},
		{
			upsert: true,
			new: true
		},
		err => {
			if (err) {
				console.log(`FEED_POST_ERROR: ${err}`);
				res.status(500).send(err);
			} else {
				console.log(`FEED_POST_SUCCESS: ${req.body._id}`);
				res.sendStatus(200);
			}
		}
	);
};

exports.getFeed = (req, res) => {
	Download.find((err, downloads) => {
		if (err) {
			console.log(`FEED_GET_ERROR: ${err}`);
			res.status(500).send(err);
		} else {
			console.log('FEED_GET_SUCCESS.');
			res.status(200).send(downloads);
		}
	}).sort({
		updatedAt: -1
	}).limit(20);
};

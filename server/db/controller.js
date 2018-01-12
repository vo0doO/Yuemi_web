var mongoose = require('mongoose');
var { VideoDownload, AudioDownload, ActiveVideoDownload, ActiveAudioDownload } = require('./schema.js');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/yuemi', { useMongoClient: true });

exports.addDownloadToDatabase = (body, mediaType) => {
	const _id = body._id;
	const title = body.title;
	const duration = body.duration;
	const uploader = body.uploader;
	const views = body.views;
	let collection = mediaType == 'video' ? VideoDownload : AudioDownload;
	collection.findOneAndUpdate(
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
			if(err) {
				console.log('ERROR UPDATING DB', _id, err);
			}
		}
	);
};

exports.addActiveDownloadToDatabase = (id, mediaType, onError) => {
	let ActiveDownloadCollection = mediaType == 'video' ? ActiveVideoDownload : ActiveAudioDownload;
	ActiveDownloadCollection.create({_id: id}, (err) => {
		if(err) {
			onError(err);
		}
	});
};

exports.removeActiveDownloadFromDatabase = (id, mediaType, onError) => {
	let ActiveDownloadCollection = mediaType == 'video' ? ActiveVideoDownload : ActiveAudioDownload;
	ActiveDownloadCollection.findById(id).remove((err) => {
		if(err) {
			onError(err);
		}
	});
};

exports.getFeed = (req, res) => {
	AudioDownload.find((err, downloads) => { // Yuemi's feed does not show videos.
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

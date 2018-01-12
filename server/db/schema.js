var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	duration: {
		type: String,
		required: true
	},
	uploader: {
		type: String,
		required: true
	},
	views: {
		type: String,
		required: true
	},
	downloads: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

const activeDownloadSchema = new Schema({
	_id: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

exports.VideoDownload = mongoose.model('VideoDownload', downloadSchema);
exports.AudioDownload = mongoose.model('AudioDownload', downloadSchema);

exports.ActiveVideoDownload = mongoose.model('ActiveVideoDownload', activeDownloadSchema);
exports.ActiveAudioDownload = mongoose.model('ActiveAudioDownload', activeDownloadSchema);

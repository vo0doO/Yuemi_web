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

exports.Download = mongoose.model('Download', downloadSchema);

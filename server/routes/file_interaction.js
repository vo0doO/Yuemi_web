var path = require('path');
var fs = require('fs');
var { execFile } = require('child_process');
var { ActiveVideoDownload, ActiveAudioDownload, VideoDownload, AudioDownload } = require('../db/schema');
var { addDownloadToDatabase, addActiveDownloadToDatabase, removeActiveDownloadFromDatabase } = require('../db/controller.js');

const _inActiveDownloads = (id, type) => {
	let collection = type == 'video' ? ActiveVideoDownload : ActiveAudioDownload;
	return collection.findById(id).exec()
		.then((activeDownload) => {
			return activeDownload !== null;
		});
};

const _inDownload = (id, type) => {
	let collection = type == 'video' ? VideoDownload : AudioDownload;
	return collection.findById(id).exec()
		.then((download) => {
			return download !== null;
		});
};

const _existsPromise = (p) => {
	return new Promise((resolve) => {
		fs.access(p, (err) => {
			if(!err) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
};

async function _isDownloaded(id, p, type) {
	let isInDownloaded = await _inDownload(id, type);
	let isInActiveDownloads = await _inActiveDownloads(id, type);
	let exists = await _existsPromise(p);
	return isInDownloaded && !isInActiveDownloads && exists;
}

exports.awaitFileRequest = (socket) => {
	socket.on('connection', client => {
		client.on('request_file', ({ mediaType, id, data }) => {
			console.log('INITIATED_FILE_REQUEST: ', id);
			let extension = mediaType == 'video' ? 'mp4' : 'mp3';
			let p = path.join(__dirname, '..', 'cache', `${id}.${extension}`);
			_isDownloaded(id, p)
				.then((bool) => {
					if(bool) {
						console.log('FILE_REQUEST_COMPLETE_ALREADY_DOWNLOADED: ', id);
						addDownloadToDatabase(data, mediaType);
						client.emit('request_complete');
					} else {
						addActiveDownloadToDatabase(id, mediaType, (err) => {
							// Seems like youtube-dl takes care of this itself..
							console.log('ERROR_CREATING_DB_ENTRY_DOWNLOAD_LIKELY_ALREADY_ACTIVE' + id + '\n' + err);
							console.log('ABORTING');
							client.emit('disconnect');
						});
						let rp = path.join(__dirname, '..', 'lib', 'request_' + mediaType + '.sh');
						const requestProcess = execFile(rp, [id]);
						requestProcess.stdout.on('data', data => {
							if (data.includes('%')) {
								client.emit('progress', data.trim().split(/\s+/)[1]);
							}
						});
						requestProcess.on('close', () => {
							removeActiveDownloadFromDatabase(id, mediaType, (err) => {
								console.log('DB_REMOVAL_ERROR: ' + id, err);
							});
							addDownloadToDatabase(data, mediaType);
							console.log('FILE_REQUEST_COMPLETE: ', id);
							client.emit('request_complete');
						});
						requestProcess.on('error', err => {
							console.log('FILE_REQUEST_ERROR: ', id, err);
							client.emit('error', err);
						});
					}
				});
		});
	});
};

exports.getFile = ({params}, res) => {
	const re = /^[a-zA-Z0-9_-]+$/;
	if (re.test(params.id)) {
		let extension = params.mediaType == 'video' ? 'mp4' : 'mp3';
		let p = path.join(__dirname, '..', 'cache', `${params.id}.${extension}`);
		fs.exists(p, exists => {
			if (exists) {
				console.log(`DL_SUCCESS: ${params.id}`);
				if(params.platform == 'WEB') {
					let filename = params.title;
					let extension = params.mediaType == 'video' ? '.mp4' : '.mp3';
					filename += extension;
					console.log('FILENAME: ' + filename);
					filename = filename.split('/').join('');
					res.status(200).download(p, filename);
				} else {
					if(params.mediaType == 'video') {
						res.status(200).sendFile(`${__dirname}/cache/${params.id}.mp4`);
					} else {
						res.status(200).sendFile(`${__dirname}/cache/${params.id}.mp3`);
					}
				}
			} else {
				res.status(400).send('DL_ERROR: FILE_NOT_FOUND');
			}
		});
	} else {
		console.log(`ILLEGAL_STRING: ${params.id}`);
		res.status(400).send(`ILLEGAL_STRING: ${params.id}`);
	}
};

exports.awaitPlaylistRequest = (socket) => {
	socket.on('connection', client => {
		client.on('request_playlist', ({ id, data }) => {
			let rp = path.join(__dirname, '..', 'lib', 'request_playlist.sh');
			let p;
			let filename = '';
			const requestProcess = execFile(rp, [id]);
			requestProcess.stdout.on('data', data => {
				if(data.includes('mp3') && data.includes('Destination')) {
					filename = data.trim().split(' ')[2];
					console.log(filename);
				} else if(data.includes('Downloading video') && data.includes(' of ') && !data.includes('1 of ')) {
					p = path.join(__dirname, '..', 'cache', filename);
					fs.readFile(p, (err, file) => {
						client.emit('file_ready', file, filename); // this, or send ready with filename then download file client side
					});
				} else if(data.includes('%')) {
					client.emit('progress', data.trim().split(/\s+/)[1]);
				}
			});
			requestProcess.on('close', () => {
				removeActiveDownloadFromDatabase(id, (err) => {
					console.log('DB_REMOVAL_ERROR: ' + id, err);
				});
				addDownloadToDatabase(data);
				console.log('FILE_REQUEST_COMPLETE: ', id);
				client.emit('request_complete');
			});
			requestProcess.on('error', err => {
				console.log('FILE_REQUEST_ERROR: ', id, err);
				client.emit('error', err);
			});
		});
	});
};

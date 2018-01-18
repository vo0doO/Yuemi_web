var path = require('path');
var fs = require('fs');
var { execFile } = require('child_process');
var { ActiveVideoDownload, ActiveAudioDownload, VideoDownload, AudioDownload } = require('../db/schema');
var { addDownloadToDatabase, addActiveDownloadToDatabase, removeActiveDownloadFromDatabase } = require('../db/controller.js');
var axios = require('axios');

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
	// if playlist doesnt exist send back error and make an alert
	socket.on('connection', client => {
		client.on('request_playlist', ({ id }) => {
			let rp = path.join(__dirname, '..', 'lib', 'request_playlist.sh'),
				p,
				filename = '',
				videoCount = 0,
				curVideo = 0,
				receivedCount = 0;
			client.on('file_received', () => {
				receivedCount += 1;
				if(receivedCount == videoCount) {
					client.emit('request_complete');
				}
			});
			const requestProcess = execFile(rp, [id]);
			requestProcess.stdout.on('data', data => {
				if(data.includes('mp3') && data.includes('thumbnail')) {
					// timing is bad, thumbnail still processing at this point
					let lines = data.split('\n'),
						line,
						trimmedLine,
						splitLine,
						filenameWithQuotes,
						filenameWithExtension;
					for(let i = 0; i < lines.length; i++) {
						line = lines[i];
						if(line.includes('mp3') && line.includes('thumbnail')) {
							trimmedLine = line.trim();
							splitLine = trimmedLine.split(' ');
							filenameWithQuotes = splitLine[4];
							filenameWithExtension = filenameWithQuotes.slice(1, -1);
							filename = path.basename(filenameWithExtension, '.mp3');
							console.log(line, trimmedLine, splitLine, filenameWithQuotes, filenameWithExtension, filename);
							p = path.join(__dirname, '..', 'cache', filename + '.mp3');
							fs.readFile(p, (err, file) => {
								console.log('EMMITING FILE:', p);
								client.emit('file_ready', file, filename);
							});
						}
					}
				} else if(data.includes('Downloading video') && data.includes(' of ')) {
					videoCount = parseInt(data.trim().split(' ')[5].trim());
					curVideo = parseInt(data.trim().split(' ')[3].trim());
					client.emit('cur_info', videoCount, curVideo, filename);
				} else if(data.includes('%')) {
					client.emit('progress', data.trim().split(/\s+/)[1]);
				}
			});
			requestProcess.on('close', (exitCode) => {
				if(exitCode == 0) {
					console.log('FILE_REQUEST_COMPLETE: ', id);
				} else {
					console.log('REQUEST_PROCESS_EXITED_WITH_ERROR');
					client.emit('request_error');
				}
			});
			requestProcess.on('error', err => {
				console.log('FILE_REQUEST_ERROR: ', id, err);
				client.emit('error', err);
			});
		});
	});
};



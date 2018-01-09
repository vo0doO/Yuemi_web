var path = require('path');
var fs = require('fs');
var { execFile } = require('child_process');

exports.awaitFileRequest = (socket) => {
	socket.on('connection', client => {
		client.on('request_file', ({ media_type, id }) => {
			console.log('INITIATED_FILE_REQUEST: ', id);
			let p;
			if(media_type == 'VIDEO') {
				p = path.join(__dirname, '..', 'cache', `${id}.mp4`);
			} else {
				p = path.join(__dirname, '..', 'cache', `${id}.mp3`);
			}
			fs.exists(p, exists => {
				if (exists) {
					client.emit('request_complete');
					console.log('FILE_REQUEST_COMPLETE: ', id);
				} else {
					console.log('SOCKET DATA:', id);
					let rp;
					if(media_type == 'VIDEO') {
						rp = path.join(__dirname, '..', 'lib', 'request_video.sh');
					} else {
						rp = path.join(__dirname, '..', 'lib', 'request_audio.sh');
					}
					const requestProcess = execFile(rp, [id]);
					requestProcess.stdout.on('data', data => {
						if (data.includes('%')) {
							client.emit('progress', data.trim().split(/\s+/)[1]);
						}
					});
					requestProcess.on('close', () => {
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
		let p;
		if(params.media_type == 'VIDEO') {
			p = path.join(__dirname, '..', 'cache', `${params.id}.mp4`);
		} else {
			p = path.join(__dirname, '..', 'cache', `${params.id}.mp3`);
		}
		fs.exists(p, exists => {
			if (exists) {
				console.log(`DL_SUCCESS: ${params.id}`);
				if(params.platform == 'WEB') {
					let filename = params.title;
					let extension = params.media_type == 'VIDEO' ? '.mp4' : '.mp3';
					filename += extension;
					console.log('FILENAME: ' + filename);
					filename = filename.split('/').join('');
					res.status(200).download(p, filename);
				} else {
					if(params.media_type == 'VIDEO') {
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

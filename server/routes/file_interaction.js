var path = require('path');
var fs = require('fs');
var { execFile } = require('child_process');

exports.awaitFileRequest = (socket) => {
	socket.on('connection', client => {
		client.on('request_file', id => {
			console.log('INITIATED_FILE_REQUEST: ', id);
			const p = path.join(__dirname, '..', 'cache', `${id}.mp3`);
			fs.exists(p, exists => {
				if (exists) {
					client.emit('request_complete');
					console.log('FILE_REQUEST_COMPLETE: ', id);
				} else {
					console.log('SOCKET DATA:', id);
					const rp = path.join(__dirname, '..', 'lib', 'request_file');
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
		const p = path.join(__dirname, '..', 'cache', `${params.id}.mp3`);
		fs.exists(p, exists => {
			if (exists) {
				console.log(`DL_SUCCESS: ${params.id}`);
				if(params.platform == 'WEB') {
					res.status(200).download(p, `${params.title}.mp3`);
				} else {
					res.status(200).sendFile(`${__dirname}/cache/${params.id}.mp3`);
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

exports.remove = ({params}, res) => {
	const re = /^[a-zA-Z0-9_-]+$/;
	if (re.test(params.id)) {
		const p = path.join(__dirname, '..', 'lib', 'remove_file');
		const removeProcess = execFile(p, [params.id]);
		removeProcess.on('close', exitCode => {
			if (exitCode == 1) {
				console.log(`FILE_NOT_FOUND: ${params.id}`);
				res.status(400).send(`FINE_NOT_FOUND: ${params.id}`);
			} else {
				console.log(`RM_SUCCESS: ${params.id}`);
				res.status(200).send(`RM_SUCCESS: ${params.id}`);
			}
		});
		removeProcess.on('error', err => {
			console.log(`ILLEGAL_STRING: ${err}`);
			res.status(400).send(`ILLEGAL_STRING: ${err}`);
		});
	} else {
		console.log(`ILLEGAL_STRING: ${params.id}`);
		res.status(400).send(`ILLEGAL_STRING: ${params.id}`);
	}
};

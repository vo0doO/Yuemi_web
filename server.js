var express = require('express');
var app = express();
var production = process.env.NODE_ENV == 'production';
var port = production ? 8080 : 8081;
var server = app.listen(port)
var socket = require('socket.io').listen(server);

var request = require('request');
var cheerio = require('cheerio');
var execFile = require('child_process').execFile;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/yuemi', {
	useMongoClient: true
});
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true, }
},{
    timestamps: true
});
var User = mongoose.model('User', userSchema);

var downloadSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    duration: String,
    users: { type: [], required: true }
},{
    timestamps: true
});
var Download = mongoose.model('Download', downloadSchema);

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/dist/'));

app.post('/api/downloads', function(req, res){
    // add a download to db
    Download.findByIdAndUpdate(
        req.body.id,
        {
            _id: req.body.id,
            $addToSet: {'users': req.body.user},
            title: req.body.title,
            duration: req.body.duration
        },
        {safe: false, upsert: true},
        function(err){
        if(err){
            console.log('FEED_POST_ERROR: ' + err);
            res.status(500).send(err);
        } else {
            console.log('FEED_POST_SUCCESS: ' + req.body.id);
            res.sendStatus(200);
        }
    });
});

app.get('/api/downloads', function(req, res){
    // list downloads
    Download.find(function(err, downloads) {
        if(err){
            console.log('FEED_GET_ERROR: ' + err);
            res.status(500).send(err);
        } else {
            console.log('FEED_GET_SUCCESS.');
            res.status(200).send(downloads);
        }
    }).sort({updatedAt: -1}).limit(20);
});

app.post('/api/user', function(req, res){
    User({
        username: req.body.username,
    }).save(function(err){
        if(err){
            console.log('CREATE_USER_ERROR: ' + err);
            res.status(500).send(err);
        } else {
            console.log('CREATE_USER_SUCCESS: ' + req.body.username);
            res.sendStatus(200);
        }
    })
})

app.get('/api/search/:query', function(req, res){
    var url = 'http://www.youtube.com/results?search_query=' + encodeURIComponent(req.params.query);
    var videos = [];
    request(url, function (err, response, body) {
        if(err){
            console.log('SEARCH_ERROR: ' + err);
            res.status(response.statusCode >= 100 && response.statusCode < 600 ? response.statusCode : 500).send('SEARCH_ERROR: ' + err);
        } else {
            // inefficient, get div then search there instead of
            // whole document
            var $ = cheerio.load(body);
            var cl = $('.yt-lockup-title');
            for(i = 0; i < cl.length; i++){
				try {
					var attribs = cl[i].children[0].attribs;
					var title = attribs.title;
					var href = attribs.href;
					var duration = cl[i].children[1].children[0].data;
					duration = duration.substr(0, duration.length-1);
					if(/\d/.test(duration)){
						videos.push({
							title,
							id: href.substr(9),
							duration: duration.substr(13),
						});
					}
				} catch (e) {
					console.log('UNABLE TO GET VIDEO:', i);
				}
            }
            console.log('SEARCH_SUCCESS: ' + req.params.query);
            res.json({videos: videos});
        }
    });
});

socket.on('connection', function (client) {
	client.on('request_file', function (id) {
		console.log('INITIATED_FILE_REQUEST: ', id);
		fs.exists(__dirname + '/cache/' + id + '.mp3', function (exists) {
			if (exists) {
				client.emit('request_complete');
				console.log('FILE_REQUEST_COMPLETE: ', id);
			} else {
				console.log("SOCKET DATA:", id);
				var requestProcess = execFile(__dirname + '/lib/request_file', [id]);
				requestProcess.stdout.on('data', function (data) {
					if (data.indexOf("%") != -1) {
						client.emit('progress', data.trim().split(/\s+/)[1]);
					}
				});
				requestProcess.on('close', function (success) {
					console.log('FILE_REQUEST_COMPLETE: ', id);
					client.emit('request_complete');
				});
				requestProcess.on('error', function (err) {
					console.log('FILE_REQUEST_ERROR: ', id);
					client.emit('error', err);
				});
			}
		});
	});
});

app.get('/api/download/:id/:title', function(req, res){
    var re = /^[a-zA-Z0-9_-]+$/;
    if(re.test(req.params.id)){
		fs.exists(__dirname + '/cache/' + req.params.id + '.mp3', (exists) => {
			if(exists) {
                console.log('DL_SUCCESS: ' + req.params.id);
                res.status(200).download(__dirname + '/cache/' + req.params.id + '.mp3', req.params.title + '.mp3');
			} else {
                res.status(400).send('DL_ERROR: FILE_NOT_FOUND');
			}
		})
    } else {
        console.log('ILLEGAL_STRING: ' + req.params.id);
        res.status(400).send('ILLEGAL_STRING: ' + req.params.id);
    }
});

app.get('/api/remove/:id', function(req, res){
    var re = /^[a-zA-Z0-9_-]+$/;
    if(re.test(req.params.id)){
        var removeProcess = execFile(__dirname + '/lib/remove_file', [req.params.id]);
		removeProcess.on('close', function(exitCode){
			if(exitCode == 1){
				console.log('FILE_NOT_FOUND: ' + req.params.id);
				res.status(400).send('FINE_NOT_FOUND: ' + req.params.id);
			} else {
				console.log('RM_SUCCESS: ' + req.params.id);
				res.status(200).send('RM_SUCCESS: ' + req.params.id);
			}
		})
		removeProcess.on('error', function(err){
			console.log('ILLEGAL_STRING: ' + error);
			res.status(400).send('ILLEGAL_STRING: ' + error);
		})
    } else {
        console.log('ILLEGAL_STRING: ' + req.params.id);
        res.status(400).send('ILLEGAL_STRING: ' + req.params.id);
    }
})

app.get('*', function(req, res){
    res.status(404).send('Not Found')
});

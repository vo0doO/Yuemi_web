'use strict';
var express = require('express');
const app = express();
const production = process.env.NODE_ENV == 'production';
const port = production ? 8080 : 8081;
const server = app.listen(port);
const socket = require('socket.io').listen(server);

var path = require('path');
var bodyParser = require('body-parser');

var search = require('./routes/search');
var file_interaction = require('./routes/file_interaction');
var controller = require('./db/controller.js'); // database operations

app.use(({headers, connection}, res, next) => {
	const ip = headers['x-forwarded-for'] || connection.remoteAddress;
	console.log('USER:', ip);
	next();
});
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '..', 'dist')));


app.post('/api/downloads', controller.addDownloadToDatabase);
app.get('/api/downloads', controller.getFeed);
app.get('/api/search/:query', search);
app.get('/api/remove/:id', file_interaction.remove);
app.get('/api/getFile/:platform/:id/:title', file_interaction.getFile); //:platform feels odd
file_interaction.awaitFileRequest(socket);
app.get('*', (req, res) => res.sendStatus(404));

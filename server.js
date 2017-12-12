var express = require('express');

var app = express();
app.get('/api/hello', function (req, res) {
	res.send('Hello');
});

app.listen(8081, function () {
	console.log('Listening on 8081');
});

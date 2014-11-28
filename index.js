var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
var Event = require('./mongo/model-event');
var formidable = require('formidable');
var fs = require('fs');


var _ = require('underscore');

var events = [];

var MONGOHQ_URL="mongodb://heroku:qZb3jrB8TU34LStxxtKKCIiPo7mZoMQ6xZ2VNzyVBWNmy4tm2n8NsOFn0ebR0Wk7FaIqEuOhKN9XHRVO-ZKRRA@lennon.mongohq.com:10031/app32045436"

// npm install mongodb
var mongoose = require('mongoose');
 
var db = mongoose.connect(MONGOHQ_URL, function(err, db) {
	// operate on the collection named "test"
	console.log('oyooo');
});

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');

server.listen(8080);

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/add-person', function (req, res) {
	res.render('add-person');
});

app.get('/event', function(req, res, next) {
	Event.find(function (err, events) {
		console.log('hallo guus');
		if (err) return next(err);
		console.log(events);
		res.send(events);
	})
});

app.get('/event/add', function(req, res) {
	res.render('add-event');
});

app.post('/event', function(req, res) {

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log(files);
		var filedata = fs.readFileSync(files['audio'].path);
		console.log(fields['word']);
		
		var eventInstance = new Event();

		eventInstance.name = fields['word'];
		eventInstance.audio = filedata;
		eventInstance.save(function(err, data) {
			console.log(err);
		});

		res.render('add-event', {done: true});
	});
	
	// TODO: Handle file upload.
	// TODO: Generate url.

});


io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

// var rules = db.collection('rules').find();

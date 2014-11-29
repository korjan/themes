var app = require('express')();
var server = require('http').Server(app);
var express = require('express');
var Event = require('./mongo/model-event');
var formidable = require('formidable');
var fs = require('fs');
var morgan = require('morgan');


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
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');

server.listen(8080);

app.get('/', function (req, res, next) {
	res.redirect('/event');
});

app.get('/add-person', function (req, res) {
	res.render('add-person');
});

app.get('/event', function(req, res, next) {

	Event.find(function (err, events) {
		if (err) return next(err);
		console.log(events);
		res.format({
			'text/html': function() {
				var eventObject = {};
				events.forEach(function(event) {
					eventObject[event.name] = '/audio2/' + event.filename;
				});
				res.render('index', {events: eventObject});
			},
			'application/json': function() {
				res.send(events);
			},
			'default': function() {
				res.sendStatus(406);
			}
		});
	})
});

app.get('/audio2/:filename', function(req, res, next) {
	Event.find({'filename': req.params.filename}, function(err, events) {
		if (err) return next(err);
		if( !events || !events.length ) {
			return next();
		}
		res.send(events[0].audio);
	});
});

app.get('/event/add', function(req, res) {
	res.render('add-event');
});

app.post('/event', function(req, res) {

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var filedata = fs.readFileSync(files['audio'].path);
		var eventInstance = new Event();

		eventInstance.name = fields['word'];
		eventInstance.audio = filedata;
		eventInstance.filename = files['audio'].name;
		eventInstance.save(function(err, data) {
			console.log(err);
		});

		res.render('add-event', {done: true});
	});

});

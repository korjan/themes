var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET

var app = require('express')();
var server = require('http').Server(app);
var express = require('express');
var Event = require('./mongo/model-event');
var formidable = require('formidable');
var fs = require('fs');
var morgan = require('morgan');
var aws = require('aws-sdk');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

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

var port = process.env.PORT || 3000
server.listen(port);

app.get('/add-person', function (req, res) {
	res.render('add-person');
});

app.get('/', function(req, res, next) {

	Event.find(function (err, events) {
		if (err) return next(err);
		console.log(events);
		var eventObject = {};
		events.forEach(function(event) {
			eventObject[event.emailadres] = '/audio2/' + event.filename;
		});
		res.render('index', {events: eventObject});
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


app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY, region: 'eu-west-1'});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.s3_object_name,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };

    console.log(s3_params);
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3-eu-west-1.amazonaws.com/'+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

// app.get('/s3test', function(req,res){
// 	res.redirect('/s3test.html');
// });

app.post('/submit_form', function(req, res){
	console.log('req:', req);
    username = req.body.username;
    full_name = req.body.full_name;
    avatar_url = req.body.avatar_url;
    // update_account(username, full_name, avatar_url); // TODO: create this function
    console.log(username, full_name, avatar_url);
    // TODO: Return something useful or redirect
});

app.get('/event', function(req, res) {
	res.render('add-event', {done: req.query.done});
});

app.post('/event', function(req, res) {

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if( !files['audio'].size ) {
			// No file given!
			console.log('no file received for adding event', fields['word']);
			return res.redirect('/event');
		}
		var filedata = fs.readFileSync(files['audio'].path);
		var eventInstance = new Event();

		eventInstance.emailadres = fields['emailadres'].replace('@', '');
		eventInstance.audio = filedata;
		eventInstance.filename = files['audio'].name;
		eventInstance.save(function(err, data) {
			console.log(err);
		});

		res.redirect('/event?done=true');
	});

});
